import Base from '../base'
import {ScanAnimation, FadeAnimation, ZoomAnimation} from '../base/animation'

const {drawAxisX, drawAxisY, formatMoney, getTextHeight, getTextWidth, drawTitle, drawUnit} = Base

const defaultOption = {
  valueVisible: false,
  valueSize: 12,
  valueColor: 'rgba(255, 255, 255, 0.65)',
  lineColor: '#c531ac',
  lineValueVisible: true,
  lineWidth: 2,
  barWidth: null,
  barOpacity: 0.8,
  barGap: 1,
  axisXKey: 'label',
  valueKey: ['value'],
  _type: 'canLayout',
}

export default class BulletColumn extends Base {
  static key = 'bulletColumn'

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    this.root.attr('class', 'wave-bar')

    this.drawAxisX = drawAxisX
    this.drawAxisY = drawAxisY
    this.formatMoney = formatMoney
    this.getTextHeight = getTextHeight
    this.formatNumber = this.numberFormat
    this.getTextWidth = getTextWidth
    this.drawTitle = drawTitle
    this.drawUnit = drawUnit
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(data) {
    // 数据格式验证,转换
    try {
      // 记录当前数据格式版本
      const version = this.cartesianCoordinateJudgingVersion(data)
      if (!version) {
        this.warn({text: '数据结构错误', onTextClick: () => console.log('数据结构错误，未匹配到符合的数据版本')})
        throw new Error('数据结构错误，未匹配到符合的数据版本')
      }
      if (version === 1) {
        this._data.source = this.cartesianCoordinateChangeOneToTwo(data)
      }
      if (version === 2) {
        this._data.source = data
      }
    } catch (err) {
      this.warn({text: '数据结构错误', onTextClick: () => console.log('数据处理时出错')})
      throw new Error('数据处理时出错,请检查你的数据是否合法')
    }

    // 开始处理数据
    // 校验数据
    this._data.source = this.cartesianCoordinateCheckData(this._data.source)

    // 图表需要数据
    this._data.data = this._data.source.label.map((x, i) => {
      return {
        label: x,
        total: this._data.source.value.map((d) => d.data[i]),
        compare: this._data.source.compareValue.map((d) => d.data[i]),
      }
    })
    this._data.name = this._data.source.value.map((x) => x.name)
    // X轴
    this._data.xAxis = this._data.source.label
    // 图例
    // 此处调用getColor方法其实违背了data函数的准则不可涉及配置项，后续更改
    if (this._data.source.value.length > 1) {
      const colors = this.getColor(1)
      this._data.data.forEach((d) => {
        d.c = colors
        d.name = this._data.name
      })
    } else {
      const colors = this.getColor(1)
      // let index = 0
      this._data.data.forEach((d) => {
        // if (i >= colors.length) {
        //   index = i % colors.length
        //   console.log(i % colors.length)
        // } else {
        //   index = i
        // }
        d.c = [colors]

        // eslint-disable-next-line prefer-destructuring
        d.name = this._data.name
      })
    }
    this._data.legends = this._data.source.value.map((x, i) => ({label: x.name, color: this._data.data[0].c[i]}))
    this._data.legends = this._data.legends.concat(
      this._data.source.compareValue.map((x) => ({label: x.name, color: this.config('lineColor')}))
    )
    // 最大值
    const dataArray = []
    this._data.source.value.map((item) => dataArray.push(...item.data))
    this._data.source.compareValue.map((item) => dataArray.push(...item.data))
    this._data.barMaxValue = Math.max.apply(null, dataArray) || 1
    console.log(this._data)
    return this
  }

  /**
   * 绘制图表和处理所有不可变的内容
   * 不可变 - 比如绘制图表的框架结构、计算一些数据发生改变但是不会被影响的内容
   * @return {object} 图表实例
   */
  draw({redraw}) {
    if (!this._data.source) {
      console.error('Data cannot be empty')
      return
    }
    if (redraw === true) {
      this.root.html('')
    }

    // 图例
    !this._isWarn && this.drawLegends({legends: this._data.legends})

    // 更新图表
    this.update()

    if (!this._isWarn) {
      this.root.style('opacity', 1)
      // 入场动画
      this.animation()
    }

    // return this
  }

  /**
   * 图表更新
   * 在计算好可变（data）和不可变（deaw）后可以利用计算的结果来绘制和更新图表了
   * @return {object} 图表实例
   */
  update() {
    // 柱子
    // const valueVisible = this.config('valueVisible')
    // const valueSize = this.fontSize(this.config('valueSize'))
    // const valueColor = this.config('valueColor')
    // const customizeBarWidth = this.config('barWidth')
    // const barGap = this.config('barGap')
    // const barOpacity = this.config('barOpacity')
    // const {xAxis, data, barMaxValue} = this._data
    // // 是否显示更新动画
    // const lineColor = this.config('lineColor')
    // const lineWidth = this.config('lineWidth')
    // const lineValueVisible = this.config('lineValueVisible')
    const valueVisible = true
    const valueSize = 12
    const valueColor = 'RGBA(255,255,255,0.6)'
    const customizeBarWidth = 0
    const barGap = 1
    const barOpacity = 1
    const {xAxis, data, barMaxValue} = this._data
    // 是否显示更新动画
    const lineColor = '#c531ac'
    const lineWidth = 2
    const lineValueVisible = false
    // 一共有几个维度
    const dimensionCount = this._data.legends.length
    // 一共有几根柱子
    const barCount = dimensionCount * this._data.xAxis.length

    // 柱子的宽度默认使用容器宽度/30
    let barWidth = customizeBarWidth || this.mainWidth / 30
    // 大于10根柱子的时候使每根柱子宽度为总宽度/双倍柱子数量，保证每组柱子间保持着一组柱子的差距
    if (barCount > 10) {
      barWidth = customizeBarWidth || this.mainWidth / (barCount * 2)
    }
    // X轴
    this._scaleX = this.baseDrawAxisX({
      rangeValue: this.mainWidth,
      domain: xAxis,
      barWidth: dimensionCount * (barWidth / 2),
    }).scale

    // Y轴
    this._scaleY = this.baseDrawAxisY({domainL: [0, barMaxValue * 1.1]}).scaleYL

    // 计算每组柱子X坐标
    const getX = (d, i) => {
      const center = this._scaleX(xAxis[i])
      const barNum = d.total.length
      const w = barNum * barWidth + (barNum - 1) * barGap
      return `translate(${center - w / 2}, ${this.mainHeight})`
    }

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    // 绘制
    const bulletColumnChart = this.root
      // 每一组柱容器
      .update('g.wave-bar-item', {
        data,
        dataKey: (d) => d.label,

        enter: {
          attr: {
            transform: getX,
          },
        },

        transitionUpdate: {
          attr: {
            transform: getX,
          },
        },
      })

      // 每个柱子
      .update('rect.wave-bar-bar', {
        data: (d) => d.total,
        // 为所有柱子设置背景 （style相当于 all: {style: {...}} 这里直接省略 all）
        style: {
          fill: (d, i, elm) => elm[i].parentNode.__data__.c[i],
          opacity: barOpacity,
        },

        // 为新添加的部分单独做一些设置
        enter: {
          style: {
            height: 0,
            width: barWidth,
            transform: 'rotateX(180deg)',
          },
        },
        // 点击事件
        on: {
          click: (d, i, elm) =>
            this.event.fire('barClick', {
              value: d,
              label: elm[i].parentNode.__data__.label,
              name: elm[i].parentNode.__data__.name[i],
            }),
        },

        // 为所有柱子设置height和x样式的过度更新 （将会自动为 update和enter 两个部分自动添加 transition: height 0.75s, x 0.75s）
        transitionAll: {
          style: {
            height: (d) => this.mainHeight - this._scaleY(d),
            x: (d, i) => barWidth * i + barGap * i,
          },
        },
      })

      // 每个柱子的线
      .upper()
      .update('rect.wave-bar-line', {
        data: (d) => {
          return d.compare
        },
        // 为所有柱子设置背景 （style相当于 all: {style: {...}} 这里直接省略 all）
        style: {
          fill: lineColor,
        },
        // 为新添加的部分单独做一些设置
        enter: {
          style: {
            height: (d) => {
              return this.mainHeight - this._scaleY(d)
            },
            width: lineWidth,
            x: (d, i) => barWidth * i + barGap * i + barWidth / 2 - lineWidth / 2,
            y: (d) => {
              return -this.mainHeight + this._scaleY(d)
            },
          },
        },
      })
    if (!this._isWarn) {
      bulletColumnChart
        // 更新每条线的数值
        .upper()
        .update('text.wave-bar-line-value', {
          data: lineValueVisible ? (d) => d.compare : null,
          text: (d) => {
            console.log(d)
            return this.formatNumber(d)
          },
          attr: {
            fill: valueColor,
            x: (d, i) => barWidth * i + barGap * i + barWidth / 2,
            y: (d) => 0 - (this.mainHeight - this._scaleY(d)),
            dy: '-0.5em',
            'font-size': valueSize,
            'text-anchor': 'middle',
          },
        })

        // 更新每个柱子的数值
        .upper()
        .update('text.wave-bar-value', {
          data: valueVisible ? (d) => d.total : null,
          text: (d) => this.formatNumber(d),
          attr: {
            fill: valueColor,
            x: (d, i) => barWidth * i + barGap * i + barWidth / 2,
            y: (d) => 0 - (this.mainHeight - this._scaleY(d)),
            dy: '-0.5em',
            'font-size': valueSize,
            'text-anchor': 'middle',
          },
        })
    }

    return this
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
    const enterAnimationDelay = 200
    const enableLoopAnimation = false
    const loopAnimationDuration = 2000
    const loopAnimationDelay = 2000
    const scanColor = this.config('scanColor')
    const zoomAnimation = new ZoomAnimation(
      {
        targets: '.wave-bar-bar, .wave-bar-line',
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
        targets: '.wave-bar-value, .wave-bar-line-value',
        duration: enterAnimationDuration * 0.3,
        type: 'fadeIn',
        loop: false,
      },
      this
    )
    const scanAnimation = new ScanAnimation(
      {
        targets: '.wave-bar-bar',
        delay: loopAnimationDelay,
        duration: loopAnimationDuration,
        color: scanColor,
        direction: 'bottom',
        loop: true,
      },
      this
    )

    enableEnterAnimation && this.root.selectAll('.wave-bar-value, .wave-bar-line-value').style('opacity', 0)
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

BulletColumn.version = '__VERSION__'
