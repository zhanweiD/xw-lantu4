/**
 * 子弹图
 * 数据少时，自动适配容器
 * 数据多事，不轮播。可能会挤在一起
 * 业务逻辑跟排行榜不一样
 */

import * as d3 from 'd3'
import Base from '../base'
import {dataUtil} from '../util'
import {ScanAnimation, FadeAnimation, ZoomAnimation} from '../base/animation'

const {drawTitle, drawUnit, getTextHeight, getTextWidth} = Base

export const STATIC = {
  LABEL_POSITION: [
    {
      key: 'TOP',
      value: '上边',
    },
    {
      key: 'LEFT',
      value: '左边',
    },
  ],
  VALUE_POSITION: [
    {
      key: 'TOP',
      value: '上边',
    },
    {
      key: 'RIGHT',
      value: '右边',
    },
  ],
}

const defaultOption = {
  labelSize: 12,
  labelRightGap: 40,
  labelXOffset: 0,
  labelYOffset: 0,
  labelColor: 'rgba(255,255,255,0.65)',
  labelPosition: STATIC.LABEL_POSITION[0].key,

  trackBagColor: 'rgba(255,255,255,0.2)',
  trackBagHeight: 32,
  trackHeight: 20,
  labelValueColor: 'rgba(255,255,255,0.65)',
  thresholdHeight: 32,
  showLabelValue: true,
  valuePosition: STATIC.VALUE_POSITION[0].key,
  valueSize: 12,
  valueWidth: 90,
  valueVisible: true,
  thresholdVisible: true,
  thresholdWidth: 4,
  labelKey: 'label',
  valueKey: 'value',
  compareValueKey: 'compareValue',
  _type: 'canLayout',
}

export default class Bullet extends Base {
  static key = 'bullet'

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    this._option = {...option, ...defaultOption, ...this._option}
    this.root.attr('class', 'wave-bullet')

    this.getTextHeight = getTextHeight
    this.drawTitle = drawTitle
    this.drawUnit = drawUnit
    this.getTextWidth = getTextWidth
    this.formatNumber = this.numberFormat
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(data) {
    // 校验数据格式是否合法 - 可根据图表自行更改
    const dataList = data.data || data
    try {
      if (dataList.length > 0) {
        this._data.source = dataList
      } else {
        throw new Error('')
      }
    } catch (err) {
      console.error('Data format error')
      throw new Error('数据结构错误')
    }
    const labelKey = data.labelKey && data.labelKey.length > 0 ? [data.labelKey[0].tag] : [this.config('labelKey')]
    const valueKey = data.valueKey && data.valueKey.length > 0 ? data.valueKey[0].tag : this.config('valueKey')
    const compareValueKey =
      data.compareKey && data.compareKey.length > 0 ? data.compareKey[0].tag : this.config('compareValueKey')
    // 转换数据为老的格式（未来有时间要干掉优化）
    const source = dataUtil.transform(labelKey, [[valueKey, compareValueKey]], dataList)
    if (data.valueKey && data.valueKey.length > 0 && data.compareKey && data.compareKey.length > 0) {
      source.valueDescription = [data.valueKey[0].name, data.compareKey[0].name]
    }
    // 将数据分类
    const classifyData = dataUtil.classify(source)
    this._data.data = classifyData[0].labels
    // 数据顺序错误扭转
    this._data.data = this._data.data.sort((a, b) => a.data[0].tag - b.data[0].tag)

    // 获取X轴标签
    this._data.labels = this._data.data.map((d) => d.label)

    // 图例 - 如果只有一个数值那么颜色按照条目个数取色 否则按照值的个数取色
    if (source.valueDescription.length > 1) {
      // const colors = d3.schemeSet3
      const colors = this.getColor([])
      this._data.data.forEach((d) => (d.c = colors))
    } else {
      const colors = this.getColor([])
      this._data.data.forEach((d, i) => (d.c = [colors[i]]))
    }

    // 图例 - 图例按照值的描述个数表示
    this._data.legends = source.valueDescription.map((v, i) => ({label: v, color: this._data.data[0].c[i]}))
    // 图例
    !this._isWarn && this.drawLegends({legends: this._data.legends})

    // 获取最大数值
    const maxValue = dataUtil.maxValue(source)
    this._data.barMaxValue = maxValue[source.unit[0]]
    this._data.barMinValue = Math.min.apply(
      null,
      this._data.source.map((x) => x.value)
    )

    // 获取比例尺
    this.getScale()

    return this
  }

  /**
   * 获取图表的X轴和Y轴方向的比例尺
   */
  getScale() {
    const trackBagHeight = this.config('trackBagHeight')
    const thresholdHeight = this.config('thresholdHeight')
    const trackHeight = this.config('trackHeight')
    const labelRightGap = this.config('labelRightGap')
    const valueSize = this.config('valueSize')
    const valueWidth = this.config('valueWidth')
    const labelPosition = this.config('labelPosition')
    const valuePosition = this.config('valuePosition')
    const showLabelValue = this.config('showLabelValue')

    this._singleMaxHeight = d3.max([trackBagHeight, thresholdHeight, trackHeight])

    // y方向比例尺
    if (labelPosition === STATIC.LABEL_POSITION[0].key) {
      // 上边
      this._scaleY = d3
        .scaleLinear()
        .domain([0, this._data.labels.length - 1])
        .range([0, this.mainHeight - this._singleMaxHeight - this.getTextHeight(12)])
    } else if (
      labelPosition === STATIC.LABEL_POSITION[1].key &&
      valuePosition === STATIC.VALUE_POSITION[0].key &&
      showLabelValue
    ) {
      // label在左边但是值在上边
      this._scaleY = d3
        .scaleLinear()
        .domain([0, this._data.labels.length - 1])
        .range([0, this.mainHeight - this._singleMaxHeight - this.getTextHeight(valueSize)])
    } else {
      // 左边
      this._scaleY = d3
        .scaleLinear()
        .domain([0, this._data.labels.length - 1])
        .range([0, this.mainHeight - this._singleMaxHeight])
    }

    // x方向比例尺
    if (labelPosition === STATIC.LABEL_POSITION[1].key) {
      // label在左边
      if (valuePosition === STATIC.VALUE_POSITION[1].key && showLabelValue) {
        // 右边而且显示
        this._scaleX = d3
          .scaleLinear()
          .domain([0, this._data.barMaxValue * 1.2])
          .range([0, this.mainWidth - valueWidth - labelRightGap]) // 减去右边和左边的宽度
      } else {
        // 上边
        this._scaleX = d3
          .scaleLinear()
          .domain([0, this._data.barMaxValue * 1.2])
          .range([0, this.mainWidth - labelRightGap]) // 减去左边的宽度
      }
    } else if (valuePosition === STATIC.VALUE_POSITION[1].key && showLabelValue) {
      // label在上边
      // 右边而且显示
      this._scaleX = d3
        .scaleLinear()
        .domain([0, this._data.barMaxValue * 1.2])
        .range([0, this.mainWidth - valueWidth]) // 100是左边文字的宽度
    } else {
      // 上边
      this._scaleX = d3
        .scaleLinear()
        .domain([this._data.barMinValue >= 0 ? 0 : this._data.barMinValue * 1.2, this._data.barMaxValue * 1.2])
        .range([0, this.mainWidth])
    }
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
    const {data} = this._data
    const {enterAnimationDuration} = this._option

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }
    this.items = this.root.update('g.wave-bullet-item', {
      data,
      dataKey: (d) => d.label,

      // 为所有g设置样式 （style相当于 all: {style: {...}} 这里直接省略 all）
      style: {
        transform: (d, i) => `translate(0, ${this._scaleY(i)}px)`,
        transition: `transform ${enterAnimationDuration / 1000}s`,
      },
    })

    this.drawRect()
    if (!this._isWarn) {
      this.drawText()
    }
    this.drawEventContainer()

    return this
  }

  /**
   * 画交互容器
   */
  drawEventContainer() {
    const dataLength = this._data.data.length
    const _gap = this.mainHeight / (dataLength - 1)

    /**
     * TODO:
     */
    const tooltipVisible = true
    const tooltipEventType = 'hover'
    this.items.selectAll('.event-container').html('')
    this.items
      .selectAll('.event-container')
      .data((d) => [d])
      .enter()
      .append('rect')
      .attr('class', 'event-container')
      .attr('stroke', '#fff')
      .attr('fill', 'black')
      .attr('stroke-opacity', '0.3')
      .style('opacity', '0')
      .attr('x', 0)
      .attr('y', (d) => {
        const gap = d.data[0].id === 0 ? 0 : 0 + (d.data[0].id - 1 / 2) * _gap
        return gap - this._scaleY(d.data[0].id)
      })
      .attr('width', this.mainWidth)
      .attr('height', (d) => (d.data[0].id === 0 || d.data[0].id === dataLength - 1 ? _gap / 2 : _gap))
      .on('mouseover', (d, i, elms) => {
        if (tooltipVisible) {
          d3.select(elms[i]).transition().style('opacity', '0.3')
        }
      })
      .on('mouseout', (d, i, elms) => {
        if (tooltipVisible) {
          d3.select(elms[i]).transition().style('opacity', '0')
        }
        if (tooltipEventType === 'hover') {
          // 隐藏tooltip
          this.tooltip.hide()
        }
      })
      .on('mousemove', (d) => {
        const tooltipData = {
          title: d.label,
          list: this._data.legends.map((x, index) => ({key: x.label, value: d.total[index], color: d.c[index]})),
        }
        if (tooltipVisible && tooltipEventType === 'hover') {
          this.tooltip.show(tooltipData)
        }
      })
      .on('click', (d) => {
        const tooltipData = {
          title: d.label,
          list: this._data.legends.map((x, index) => ({key: x.label, value: d.total[index], color: d.c[index]})),
          ...this.tooltipPosition,
        }
        if (tooltipVisible && (tooltipEventType === 'click' || this.config('enableLoopTooltip'))) {
          this.tooltip.show(tooltipData)
        }
        // this.fire(tooltipData)
      })
  }

  /**
   * 画长方形
   */
  drawRect() {
    const trackBagColor = this.config('trackBagColor')
    const trackBagHeight = this.config('trackBagHeight')
    const labelSize = this.config('labelSize')
    const valuePosition = this.config('valuePosition')
    const showLabelValue = this.config('showLabelValue')
    const valueWidth = this.config('valueWidth')
    const labelPosition = this.config('labelPosition')
    const labelRightGap = this.config('labelRightGap')
    const trackHeight = this.config('trackHeight')
    const thresholdWidth = this.config('thresholdWidth')
    const thresholdHeight = this.config('thresholdHeight')

    let trackBagWidth = this.mainWidth
    // rect所在位置的y属性
    let rectY = 0
    if (valuePosition === STATIC.VALUE_POSITION[1].key && showLabelValue) {
      trackBagWidth -= valueWidth
    }
    if (labelPosition === STATIC.LABEL_POSITION[1].key) {
      trackBagWidth -= labelRightGap
    } else {
      rectY = this.getTextHeight(labelSize)
    }
    // 单个容器的偏移量y
    this._offsetY = rectY + this._singleMaxHeight / 2

    const itemG = this.items.update('g.rect-container', {
      data: (d) => [d],
      style: {
        transform: `translate(${labelPosition === STATIC.LABEL_POSITION[1].key ? labelRightGap : 0}px, ${
          this._offsetY
        }px)`,
      },
    })

    itemG.update('rect.wave-bullet-bar-bag', {
      data: (d) => [d.label],
      // 为所有柱子设置背景 （style相当于 all: {style: {...}} 这里直接省略 all）
      style: {
        fill: trackBagColor,
        y: -trackBagHeight / 2,
        width: trackBagWidth,
        height: trackBagHeight,
      },
    })

    itemG.update('rect.wave-bullet-bar', {
      data: (d) => [d.data[0].values[0]],
      style: {
        fill: (d, i) => this._data.data[i].c[0],
        y: -trackHeight / 2,
        height: trackHeight,
      },
      enter: {
        style: {
          width: 0,
        },
      },
      transitionAll: {
        style: {
          width: (d) => this._scaleX(d),
        },
      },
    })

    itemG.update('rect.wave-bullet-threshold', {
      data: (d) => [d.data[0].values[1]],
      style: {
        fill: (d, i) => this._data.data[i].c[1],
        x: (d) => this._scaleX(d),
        y: -thresholdHeight / 2,
        width: thresholdWidth,
        height: thresholdHeight,
      },
    })
  }

  /**
   * 填充文字
   */
  drawText() {
    //  const {labelSize, labelColor, labelPosition, showLabelValue, valueSize, valuePosition, labelValueColor} = this._option
    const valueVisible = this.config('valueVisible')
    const thresholdVisible = this.config('thresholdVisible')
    const labelSize = this.config('labelSize')
    const labelColor = this.config('labelColor')
    const labelPosition = this.config('labelPosition')
    const showLabelValue = this.config('showLabelValue')
    const valueSize = this.config('valueSize')
    const valuePosition = this.config('valuePosition')
    const labelValueColor = this.config('labelValueColor')

    let labelAttr = {
      'dominant-baseline': 'hanging',
      transform: 'translate(0,0)',
    }
    if (labelPosition === STATIC.LABEL_POSITION[1].key) {
      labelAttr = {
        'dominant-baseline': 'middle',
        transform: `translate(0, ${this._offsetY})`,
        'text-anchor': 'start',
      }
    }
    labelAttr.dx = this.config('labelXOffset')
    labelAttr.dy = this.config('labelYOffset')

    this.items.update('text.wave-bullet-label', {
      data: (d) => [d.label],
      text: (d) => d,
      attr: {
        fill: labelColor,
        'font-size': this.fontSize(labelSize),
        ...labelAttr,
      },
    })

    if (!showLabelValue) return this
    let valueAttr = {
      'dominant-baseline': STATIC.LABEL_POSITION[1].key === labelPosition ? 'text-after-edge' : 'hanging',
      transform: 'translate(0,0)',
    }
    if (valuePosition === STATIC.VALUE_POSITION[1].key) {
      valueAttr = {
        'dominant-baseline': 'middle',
        transform: `translate(0, ${this._offsetY})`,
      }
    }

    const itemG = this.items.update('g.value-container', {
      data: (d) => [d],
      attr: valueAttr,
    })
    itemG.update('text.wave-bullet-value', {
      data: (d) => {
        let dataValue = d.data[0].values
        if (!valueVisible && thresholdVisible) {
          dataValue[0] = null
        } else if (valueVisible && !thresholdVisible) {
          dataValue[1] = null
        } else if (!valueVisible && !thresholdVisible) {
          dataValue = [null, null]
        }
        return dataValue
      },
      text: (d) => {
        if (d || d === 0) {
          return this.formatNumber(d)
        }
        return ''
      },
      attr: {
        fill: labelValueColor,
        'font-size': this.fontSize(valueSize),
        x: (d, i) => this.getValueAttr(d, i).x,
        'text-anchor': 'middle',
      },
    })

    return this
  }

  /**
   * 获取值对应的x坐标
   * @param d 数值
   * @param i 数值所在的Index
   */
  getValueAttr(d, i) {
    const {labelRightGap, labelPosition, valueWidth, valuePosition} = this._option
    let x = this._scaleX(d)

    // value值在上边
    if (valuePosition === STATIC.VALUE_POSITION[1].key) {
      x = this.mainWidth - valueWidth + 20 + i * 50 // 20是间隔
    }

    // label在左边
    if (labelPosition === STATIC.LABEL_POSITION[1].key && valuePosition === STATIC.VALUE_POSITION[0].key) {
      x += labelRightGap // 20是间隔
    }

    // 右边
    const valueAttr = {
      x,
    }

    return valueAttr
  }

  // 是否显示入场动画
  animation() {
    const enableEnterAnimation = true
    const enterAnimationDuration = 1000
    const enterAnimationDelay = 500
    const enableLoopAnimation = false
    const loopAnimationDuration = 1000
    const loopAnimationDelay = 500
    const scanColor = 'pink'

    const zoomAnimation = new ZoomAnimation(
      {
        targets: '.wave-bullet-bar',
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
        targets: '.wave-bullet-value',
        duration: enterAnimationDuration * 0.3,
        type: 'fadeIn',
        loop: false,
      },
      this
    )
    const scanAnimation = new ScanAnimation(
      {
        targets: '.wave-bullet-bar',
        delay: loopAnimationDelay,
        duration: loopAnimationDuration,
        direction: 'right',
        color: scanColor,
        loop: true,
      },
      this
    )

    enableEnterAnimation && this.root.selectAll('.wave-bullet-value').style('opacity', 0)
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

    // tooltip 动画处理
    this.loopTooltip(this.root.selectAll('.event-container'))

    return this
  }
}

Bullet.version = '__VERSION__'
