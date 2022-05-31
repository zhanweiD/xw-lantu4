import * as d3 from 'd3'
import Base from '../base'
import {FadeAnimation, ZoomAnimation} from '../base/animation'
import {dataUtil, getTextHeight} from '../util'

const {drawTitle, drawUnit, createUuid, drawAxisX, drawAxisY, drawValueAxisX, formatMoney, getTextWidth} = Base

// 默认配置
const defaultOption = {
  valueAxisXTickCount: 8,
  valueVisible: true,
  valueSize: 12,
  valueColor: 'rgba(0,0,0,1)',
  typeKey: 'type',
  valueKey: 'value',
  _type: 'canLayout',
}

export default class Histogram extends Base {
  static key = 'histogram'

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    this._fontSize = 12
    // this._fontSize = this.config('fontSize')
    this._id = createUuid()
    this._gradientId = `wave-histogram-gradient-${this._id}`
    this.state = 'render'
    this.root.attr('class', 'wave-histogram')
    this.drawTitle = drawTitle
    this.drawUnit = drawUnit
    this.drawAxisX = drawAxisX
    this.drawAxisY = drawAxisY
    this.drawValueAxisX = drawValueAxisX
    this.formatMoney = formatMoney
    this.getTextHeight = getTextHeight
    this.getTextWidth = getTextWidth
    this.formatNumber = this.numberFormat
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(source) {
    // 新加一个变量判断是哪种数据结构
    this.dataRule = 'old'
    let valueList = ['value']
    let typeList = ['label']
    if (Object.prototype.toString.call(source) === '[object Object]') {
      valueList = [source.valueKey.tag]
      typeList = [source.labelKey.tag]
      this.dataRule = 'new'
      source = source.data
    }
    // 校验数据格式是否合法 - 可根据图表自行更改
    try {
      if (source.length > 0) {
        this._data.source = source
      } else {
        throw new Error('')
      }
    } catch (err) {
      console.error('Data format error')
      throw new Error('数据结构错误')
    }

    // 转换数据为老的格式（未来有时间要干掉优化）
    source = dataUtil.transform(typeList, [valueList], source)
    const valueAxisXTickCount = 8
    const list = source.data
    const isStacked = !!source.dimension[0]
    const labels = isStacked ? source.dimension[0].labels : ['']

    // 统计数值范围
    const valueRange = dataUtil.range(source)[source.unit[0]]
    // 颜色 按照第一个维度的标签数量来
    const colors = isStacked ? this.getColor(source.dimension[0].labels.length) : this.getColor(1)

    // 图例
    const legends = isStacked ? source.dimension[0].labels.map((v, i) => ({label: v, color: colors[i]})) : []

    // 生成X轴刻度尺
    this._scaleX = d3.scaleLinear().range([0, this.mainWidth]).domain([0, valueRange[1]])
    let ticks = this._scaleX.ticks(valueAxisXTickCount)
    const step = ticks[1] - ticks[0]

    // 补充一个刻度
    this._scaleX.domain([0, ticks[ticks.length - 1] + step])
    ticks = this._scaleX.ticks(valueAxisXTickCount)

    ticks[0] !== 0 && ticks.unshift(0)

    // 将刻度组装为各个间隔区的数据
    const data = []
    for (let i = 0; i < ticks.length - 1; i++) {
      data.push({
        // 记录每个区间的各个分组的数量
        // eslint-disable-next-line no-unused-vars
        group: labels.map((_v) => []),
        // 该区间的范围值
        range: [ticks[i], ticks[i + 1]],
        key: `${ticks[i]}-${ticks[i + 1]}`,
        total: 0,
      })
    }

    // 统计各条目所属的区间
    const datal = data.length
    for (let i = 0, l = list.length; i < l; i++) {
      const item = list[i]
      const value = item.values[0]

      for (let n = 0; n < datal; n++) {
        const d = data[n]
        if (value >= d.range[0] && value < d.range[1]) {
          const labelIndex = labels.indexOf(item.dimensions[0])
          d.group[isStacked ? labelIndex : 0].push(item)
          d.total++
          break
        }
      }
    }

    // 统计数量做多的区间
    let maxTotal = 0
    data.forEach((d) => {
      maxTotal = Math.max(maxTotal, d.total)
    })

    this._data.colors = colors
    this._data.legends = legends
    this._data.data = data
    this._data.maxTotal = maxTotal

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
      this.root.attr('opacity', 1)
      this.root.html('')
    }
    // 图例
    !this._isWarn && this.drawLegends({legends: this._data.legends})

    // 更新图表
    this.update()

    // 入场动画
    this._isWarn || this.animation()

    // return this
  }

  /**
   * 图表更新
   * 在计算好可变（data）和不可变（draw）后可以利用计算的结果来绘制和更新图表了
   * @return {object} 图表实例
   */
  update() {
    // const valueVisible = this.config('valueVisible')
    const valueSize = this.fontSize(this.config('valueSize'))
    const valueColor = this.config('valueColor')

    // const valueShadowVisible = this.config('valueShadowVisible')
    // const valueShadowColor = this.config('valueShadowColor')
    // const valueShadowOffset = this.config('valueShadowOffset')

    const valueVisible = true
    // const valueSize = 12
    // const valueColor = 'RGBA(0,0,0,1)'

    const valueShadowVisible = true
    const valueShadowColor = 'RGBA(0,0,0,1)'
    const valueShadowOffset = 2
    const {maxTotal, data, colors} = this._data

    // 柱子宽度
    const barWidth = this._scaleX(data[0].range[1]) - this._scaleX(data[0].range[0])

    // 先搞X轴
    this._scaleX = this.drawValueAxisX({
      scale: this._scaleX,
      lineVisible: false,
    })

    // 再搞Y轴
    this._scaleY = this.baseDrawAxisY({domainL: [0, maxTotal * 1.1]}).scaleYL

    // 更新
    this.root
      .update('g.wave-histogram-item', {
        data,
        dataKey: (d) => d.key,

        enter: {
          attr: {
            transform: (d) => `translate(${this._scaleX(d.range[0])}, ${this.mainHeight})`,
          },
          on: {
            click: (d) => console.log(d),
          },
        },
        transitionUpdate: {
          attr: {
            transform: (d) => `translate(${this._scaleX(d.range[0])}, ${this.mainHeight})`,
          },
        },
      })

      // 更新柱子
      .update('rect.wave-histogram-bar', {
        data: (d) => d.group,

        style: {
          fill: (d, i) => colors[i],
        },
        enter: {
          style: {
            width: barWidth,
            height: 0,
            transform: 'rotateX(180deg)',
          },
        },
        transitionAll: {
          style: {
            width: barWidth,
            height: (d) => this.mainHeight - this._scaleY(d.length),
            y: (d, i, elm) => {
              let y = 0
              for (let n = i - 1; n > -1; n--) {
                y += this.mainHeight - this._scaleY(elm[n].__data__.length)
              }
              return y
            },
          },
        },
      })

      // 每个值
      .upper()
      .update('text.wave-histogram-value', {
        data: valueVisible ? (d) => d.group : null,
        enter: {
          attr: {
            fill: valueColor,
            dy: '-0.5em',
            dx: barWidth / 2,
            'font-size': valueSize,
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
          },
          style: {
            'text-shadow': valueShadowVisible
              ? `${valueShadowOffset[0]}px ${valueShadowOffset[1]}px ${valueShadowOffset[2]}px ${valueShadowColor}`
              : '',
          },
        },
        attr: {
          y: (d, i, elms) => {
            let y = 0
            for (let n = i - 1; n > -1; n--) {
              y += this.mainHeight - this._scaleY(elms[n].__data__.length)
            }
            y += (this.mainHeight - this._scaleY(d.length)) / 2
            return 0 - y
          },
        },
        text: (d) => {
          if (this._isWarn) {
            return ''
          }
          return d.length ? this.formatNumber(d.length) : ''
        },
      })

    // 报错之后重新显示标题和单位，一定要在单位和图例后面，因为要改变判断是否是报错后重新渲染的关键key
    // 这里有两种实现方式，一种是重绘标题和单位，另外一种是将标题和单位隐藏起来
    // 这里选择隐藏，目测性能消耗较少
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
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
    const enableEnterAnimation = true
    const enterAnimationDuration = 2000
    const enterAnimationDelay = 500
    const zoomAnimation = new ZoomAnimation(
      {
        targets: '.wave-histogram-bar',
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
        targets: '.wave-histogram-value',
        duration: enterAnimationDuration * 0.3,
        type: 'fadeIn',
        loop: false,
      },
      this
    )

    if (enableEnterAnimation) {
      this.root.selectAll('.wave-histogram-value').style('opacity', 0)
      zoomAnimation.event.on('end', () => fadeAnimation.play())
      fadeAnimation.event.on('end', () => {
        this.ready()
      })
      zoomAnimation.play()
    } else {
      this.ready()
    }
    return this
  }
}

Histogram.version = '__VERSION__'
