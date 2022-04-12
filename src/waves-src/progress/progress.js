import Base from '../base'
import {ScanAnimation, FadeAnimation, ZoomAnimation} from '../base/animation'
import {dataUtil, getTextHeight, getTextWidth} from '../util'

const {drawTitle, drawUnit, isObject} = Base

const defaultOption = {
  thresholdHeight: 10,
  rectHeight: 40,
  labelKey: 'label',
  valueKey: 'value',
  maxValueKey: 'maxValue',
  _type: 'canLayout',
}

export default class Progress extends Base {
  static key = 'progress'

  constructor(option) {
    super(option, defaultOption)
    // this._option = {...option, ...defaultOption, ...this.baseOption, ...this.option}
    this._option.secondTitle = this.config('secondTitle')
    this._data = {}
    this.root.attr('class', 'wave-progress')

    this.drawTitle = drawTitle
    this.drawUnit = drawUnit
    this.getTextHeight = getTextHeight
    this.getTextWidth = getTextWidth
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(source) {
    try {
      // 校验数据格式是否合法 - 可根据图表自行更改
      if (isObject(source)) {
        this._data.source = source
      }
    } catch (err) {
      console.error('Data format error', err.message)
    }

    // 转换数据为老的格式（未来有时间要干掉优化）
    source = dataUtil.transform(
      [this.config('labelKey')],
      [[this.config('valueKey'), this.config('maxValueKey')]],
      [source]
    )

    // 将数据分类
    const classifyData = dataUtil.classify(source)
    this._data.data = classifyData[0].labels

    // 获取X轴标签
    this._data.labels = this._data.data.map((d) => d.label)

    // 图表用到的颜色
    // this._colors = d3.schemeSet3
    this._colors = this.getColor([])

    // 图例 - 图例按照值的描述个数表示
    this._data.legends = source.valueDescription.map((v, i) => ({label: v, color: this._colors[i]}))

    this._data.barMaxValue = this._data.source.maxValue

    this._data.rate =
      this._data.data[0].total[0] / (this._data.data[0].total[1] === 0 ? 1 : this._data.data[0].total[1])
    return this
  }

  /**
   * 绘制图表和处理所有不可变的内容
   * 不可变 - 比如绘制图表的框架结构、计算一些数据发生改变但是不会被影响的内容
   * @return {object} 图表实例
   */
  draw({redraw}) {
    if (redraw === true) {
      this.root.html('')
    }
    if (!this._data.source) {
      console.error('Data cannot be empty')
      return
    }

    // 更新图表
    this.update()

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
      this.root.style('opacity', 1)
      // 入场动画
      this.animation()
    }
    // return this
  }

  /**
   * 图表更新
   * 在计算好可变（data）和不可变（draw）后可以利用计算的结果来绘制和更新图表了
   * @return {object} 图表实例
   */
  update() {
    const {data} = this._data
    const {enterAnimationDuration} = this._option

    this.items = this.root.update('g.wave-progress-item', {
      data: [data[0]], // 只取第一个
      dataKey: (d) => d.label,

      // 为所有g设置样式 （style相当于 all: {style: {...}} 这里直接省略 all）
      style: {
        transform: () => `translate(${this.mainWidth / 2}px, ${this.mainHeight / 2}px)`,
        transition: `transform ${enterAnimationDuration / 1000}s`,
      },
    })

    this.drawProgress()

    return this
  }

  /**
   * 画进度条
   */
  drawProgress() {
    const {
      rectHeight = 40,
      backgroundColor = 'RGBA(255, 255, 255, 0.4)',
      thresholdColor = 'RGBA(255, 255, 255, 0.4)',

      labelColor = 'RGBA(255, 255, 255, 0.4)',
      labelSize = 12,

      labelShadowVisible = false,
      labelShadowOffset = 0,
      labelShadowColor = 'RGBA(255, 255, 255, 0.4)',

      valueVisible = true,
      valueOffsetY = 0,
    } = this._option

    let {backgroudHeight = 20} = this._option
    const barHeight = rectHeight + backgroudHeight
    const {rate} = this._data
    this.items.update('rect', {
      data: (d) => [d.label],
      attr: {
        width: this.mainWidth,
        height: barHeight,
        fill: backgroundColor,
        x: -this.mainWidth / 2,
        y: -barHeight / 2,
      },
    })

    backgroudHeight = backgroudHeight > barHeight ? barHeight : backgroudHeight
    let width = this.mainWidth
    // 保留几位小数
    const percentNum = this.config('percentNum')
    const percent = (rate * 100).toFixed(percentNum)
    if (rate > 1) {
      width = 1 * this.mainWidth
    } else {
      width = rate * this.mainWidth
    }
    this.items.update('rect.wave-progress-bar', {
      data: (d) => [d.data[0].values],
      attr: {
        height: barHeight - backgroudHeight,
        fill: this._colors[0],
        x: -this.mainWidth / 2,
        y: -barHeight / 2 + backgroudHeight / 2,
      },
      enter: {
        style: {
          width: 0,
        },
      },
      transitionAll: {
        style: {
          width,
        },
      },
    })

    const labelWidth = getTextWidth(`${percent}%`, this.fontSize(labelSize))
    let labelX = -this.mainWidth / 2 + width + 10
    if (labelX > this.mainWidth / 2 - labelWidth) {
      labelX = this.mainWidth / 2 - labelWidth
    }
    if (!this._isWarn) {
      // label
      this.items.update('text.wave-progress-label', {
        data: (d) => {
          return [d.label]
        },
        text: valueVisible ? `${percent}%` : '',
        attr: {
          fill: labelColor,
          'font-size': this.fontSize(labelSize),
          'alignment-baseline': 'text-after-edge',
          'dominant-baseline': 'middle',
          // y: barHeight / 2 - backgroudHeight / 2,
          y: 20 - valueOffsetY,
          x: labelX,
        },
        style: {
          'text-shadow': labelShadowVisible
            ? `${labelShadowOffset[0]}px ${labelShadowOffset[1]}px ${labelShadowOffset[2]}px ${labelShadowColor}`
            : '',
        },
      })
    }

    // 画阈值，如果超过 1，默认画
    const {thresholdHeight} = this._option
    if (rate > 1) {
      this.items.update('rect.threshold', {
        data: (d) => [d.data[0].values],
        style: {
          fill: thresholdColor,
          x: -this.mainWidth / 2 + this.mainWidth / rate,
          y: -thresholdHeight / 2,
          width: 4,
          height: thresholdHeight,
        },
      })
    }
  }

  /**
   * 图表动画
   * 这里仅处理入场动画和轮播动画
   * @return {object} 图表实例
   */
  animation() {
    // const enableEnterAnimation = this.config('enableEnterAnimation')
    // const enterAnimationDuration = this.config('enterAnimationDuration')
    // const enterAnimationDelay = this.config('enterAnimationDelay')
    // const enableLoopAnimation = this.config('enableLoopAnimation')
    // const loopAnimationDuration = this.config('loopAnimationDuration')
    // const loopAnimationDelay = this.config('loopAnimationDelay')
    // const scanColor = this.config('scanColor')
    const enableEnterAnimation = true
    const enterAnimationDuration = 2000
    const enterAnimationDelay = 500
    const enableLoopAnimation = false
    const loopAnimationDuration = 2000
    const loopAnimationDelay = 500
    const scanColor = 'RGBA(255, 255, 255, 0.4)'
    const zoomAnimation = new ZoomAnimation(
      {
        targets: '.wave-progress-bar',
        delay: enterAnimationDelay,
        duration: enterAnimationDuration * 0.7,
        type: 'enlarge',
        direction: 'both',
        loop: false,
      },
      this
    )
    const fadeAnimation = new FadeAnimation(
      {
        targets: '.wave-progress-label',
        duration: enterAnimationDuration * 0.3,
        type: 'fadeIn',
        loop: false,
      },
      this
    )
    const scanAnimation = new ScanAnimation(
      {
        targets: '.wave-progress-bar',
        delay: loopAnimationDelay,
        duration: loopAnimationDuration,
        direction: 'right',
        color: scanColor,
        loop: true,
      },
      this
    )

    enableEnterAnimation && this.root.selectAll('.wave-progress-label').style('opacity', 0)
    if (enableEnterAnimation && enableLoopAnimation) {
      zoomAnimation.event.on('end', () => fadeAnimation.play())
      fadeAnimation.event.on('end', () => {
        this.ready()
        scanAnimation.play()
      })
      zoomAnimation.play()
    } else if (enableEnterAnimation) {
      zoomAnimation.event.on('end', () => fadeAnimation.play())
      fadeAnimation.event.on('end', () => {
        this.ready()
      })
      zoomAnimation.play()
    } else if (enableLoopAnimation) {
      this.ready()
      scanAnimation.play()
    } else {
      this.ready()
    }

    return this
  }
}

Progress.version = '__VERSION__'
