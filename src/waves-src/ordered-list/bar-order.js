import * as d3 from 'd3'
import Base from '../base'
import {ScrollAnimation, FadeAnimation, ZoomAnimation} from '../base/animation'
import {dataUtil, timer, getTextHeight, getTextWidth} from '../util'

const {createUuid, drawTitle, drawUnit} = Base

export const STATIC = {
  GRADIENT_DIRECTION: [
    {
      key: 'HIRONZATAL',
      value: '水平',
    },
    {
      key: 'VERTICAL',
      value: '垂直',
    },
  ],
  ORDER: [
    {
      key: 'MAX_MIN',
      value: '大到小',
    },
    {
      key: 'DEFAULT',
      value: '默认',
    },
  ],
}

const defaultOption = {
  // labelSize: 12,
  labelColor: 'rgba(255, 255, 255, 0.65)',
  gap: 6,
  bgLineColor: 'rgba(255, 255, 255, 0.2)',
  lineHeight: 8,
  lineOffset: 60,
  // 是否加序号，0时不加，1时加一位，2+加两位
  indexLength: 0,
  maxRow: 8,
  gradientDirection: STATIC.GRADIENT_DIRECTION[0].key,

  labelKey: 'label',
  valueKey: 'value',
  order: STATIC.ORDER[1].key,
  percentVisible: false,
  iconVisible: false,
  iconHeight: 35,
  iconWidth: 60,
  iconX: 10,
  iconY: 45,

  loopAnimation: true,
  loopTime: 4000,
  updateDuration: 1500,
  _type: 'canLayout',
}

export default class BarOrder extends Base {
  static key = 'orderedList'

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    this._option = {...option, ...defaultOption, ...this.baseOption, ...this._option}
    this.uuid = createUuid()
    this.isDelete = false
    this.root.attr('class', 'wave-bar-order')

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
    try {
      const version = this.cartesianCoordinateJudgingVersion(data)
      if (!version) {
        console.error('数据结构错误')
        this.warn({text: '数据结构错误', onTextClick: () => console.log('数据结构错误，未匹配到符合的数据版本')})
        throw new Error('数据结构错误')
      }
      if (data.length > 0) {
        this._data.source = data
      } else {
        throw new Error('')
      }
    } catch (err) {
      console.error('Data format error')
      this.warn({text: '数据结构错误', onTextClick: () => console.log('数据处理时出错')})
      throw new Error('数据结构错误')
    }

    // 转换数据为老的格式（未来有时间要干掉优化）
    const source = dataUtil.transform([this.config('labelKey')], [[this.config('valueKey')]], data)

    // const {maxRow} = this._option
    const maxRow = this.config('maxRow')

    // 从大到小排序
    const MAX_MIN = 'MAX_MIN' === STATIC.ORDER[0].key
    if (MAX_MIN) {
      this.getOriginalOrderData(source)
    }

    // 将数据分类
    this._data.data = dataUtil.classify(source, true)[0].labels
    const databk = this._data.data
    // 拿出labels 和 values，形成数组
    this._labels = []
    this._values = []
    this._icon = []
    databk.forEach((item) => {
      this._labels.push(item.label)
      this._values.push(item.data[0].values[0])
    })
    data.forEach((item) => {
      this._icon.push(item.icon)
    })
    const {mainWidth} = this
    // const {
    //   lineOffset,
    //   gradientDirection,
    // } = this._option
    const [lineOffset, gradientDirection] = ['lineOffset', 'gradientDirection'].map((i) => this.config(i))

    this._valuesObj = this._values.map((item, index) => ({
      label: this._labels[index],
      data: item,
      originIndex: index,
      icon: this._icon[index],
    }))

    // 补数据
    const dataLength = this._valuesObj.length
    if (dataLength < maxRow) {
      const range = d3.range(maxRow - dataLength)
      range.forEach((item, index) => {
        this._valuesObj.push({
          label: '',
          data: null,
          originIndex: dataLength + index,
          icon: '',
        })
      })
    }

    // 数据展示的最大线段长度
    const maxRectWidth = mainWidth - lineOffset

    // 获取最大数值
    const maxValue = dataUtil.maxValue(source, source.maxValue)[source.unit[0]]

    // 宽度比例尺
    this._scaleX = d3.scaleLinear().domain([0, maxValue]).range([0, maxRectWidth])

    // 颜色
    if (gradientDirection === STATIC.GRADIENT_DIRECTION[0].key) {
      // this.colors = d3.schemeSet3// .slice(0, 2)
      this.colors = this.getColor(2)
      // 水平渐变
      this.drawLineColor()
    } else {
      this.colors = this.getColor(this._labels.length)
      // this.colors = d3.schemeSet3
    }
    return this
  }

  // 画横向的渐变色
  drawLineColor() {
    this._random = Math.random()

    const linearGradient = this.root
      .append('defs')
      .append('linearGradient')
      .attr('id', `lineGradient${this._random}`)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', this.mainWidth)
      .attr('y2', 0)

    linearGradient.append('stop').attr('offset', '0%').attr('stop-color', this.colors[0])

    linearGradient.append('stop').attr('offset', '100%').attr('stop-color', this.colors[1])
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
      !this._isWarn && this.root.style('opacity', 1)
      this.root.html('')
    }

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    this.drawClipPath()

    // 更新图表
    this.update()

    // 入场动画
    !this._isWarn && this.animation()

    // return this
  }

  // 画遮挡区域
  drawClipPath() {
    // 多个实例时防止污染
    const random = Math.random()

    this.root
      .append('defs')
      .append('clipPath')
      .attr('id', `contentClipPath${random}`)
      .append('rect')
      .attr('width', this.mainWidth)
      .attr('height', this.mainHeight)

    this.clipPathContainer = this.root
      .append('g')
      .attr('class', 'content-clip-path')
      .attr('clip-path', `url(#contentClipPath${random})`)
  }

  /**
   * 图表更新
   * 在计算好可变（data）和不可变（draw）后可以利用计算的结果来绘制和更新图表了
   * @return {object} 图表实例
   */
  update() {
    // 绘制更新
    // const {maxRow =8, lineHeight = 8, labelSize = 12, valueSize = 12, gap = 6}  = this._option
    const [maxRow, lineHeight, labelSize, valueSize, gap] = [
      'maxRow',
      'lineHeight',
      'labelSize',
      'valueSize',
      'gap',
    ].map((i) => this.config(i))
    // 原需：当数据条数少于需展示的条数时，按照数据条数撑满容器
    // 原需：当数据条数多于需展示的条数时，按照需展示的条数撑满容器
    // 20191014改：按照需展示的条数撑满容器
    const maxFontSize = labelSize > valueSize ? labelSize : valueSize
    const length = maxRow - 1
    // const length = maxRow - this._values.length > 0 ? this._values.length - 1 : maxRow - 1
    this.getTextHeight(this.fontSize(labelSize))
    this._scaleY = d3
      .scaleLinear()
      .domain([0, length])
      .range([this.getTextHeight(this.fontSize(maxFontSize)) + gap + lineHeight / 2, this.mainHeight - lineHeight])
    // .range([45, this.mainHeight - lineHeight])

    this.drawContent()
    this.drawEventContainer()

    return this
  }

  /**
   * 画交互容器
   */
  drawEventContainer() {
    // const {maxRow} = this._option
    const maxRow = 1

    const dataLength = maxRow
    const _gap = this.mainHeight / dataLength
    const tooltipVisible = this.config('tooltipVisible')
    const tooltipEventType = this.config('tooltipEventType')
    // this._eventContainer = this.clipPathContainer.selectAll('.event-container').html('')
    this._eventContainer = this.clipPathContainer
      .selectAll('.event-container')
      .data(this._valuesObj)
      .enter()
      .append('rect')
      .attr('class', 'event-container')
      .attr('stroke', '#fff')
      .attr('fill', 'black')
      .attr('stroke-opacity', '0.3')
      .style('opacity', '0')
      .attr('x', 0)
      .attr('y', (d) => (d.originIndex === 0 ? 0 : 0 + d.originIndex * _gap))
      .attr('width', this.mainWidth)
      .attr('height', _gap)
      .on('mouseover', (d, i, elms) => {
        // if (loopAnimation && tooltipVisible) {
        //   this._clearTimer()
        // }
        if (tooltipVisible) {
          d3.select(elms[i]).transition().style('opacity', '0.3')
        }
      })
      .on('mouseout', (d, i, elms) => {
        // if (this._values.length > this._option.maxRow && this.config('loopAnimation') && tooltipVisible) {
        //   this.interval()
        // }
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
          list: [{key: d.label, value: d.data}],
        }
        if (tooltipVisible && tooltipEventType === 'hover') {
          this.tooltip.show(tooltipData)
        }
      })
      .on('click', (d) => {
        const tooltipData = {
          list: [{key: d.label, value: d.data}],
          ...this.tooltipPosition,
        }
        if (tooltipVisible && (tooltipEventType === 'click' || this.config('enableLoopTooltip'))) {
          this.tooltip.show(tooltipData)
        }
        this.event.fire('rectClick', {data: tooltipData, e: d3.event})
        // this.fire(tooltipData)
      })
  }

  /**
   * 画画画
   */
  drawContent() {
    // 这里先简单的实现，后续所有的动画时间都应在一处实现
    // 绘制分组容器
    this._itemsG = this.clipPathContainer.update('g.wave-bar-order-item', {
      data: this._valuesObj,
      dataKey: (d) => d.label,
      style: {
        transform: (d, i) => `translate(0, ${this._scaleY(i)}px)`,
        // transition: `transform ${updateDurations / 1000}s`,
      },
    })

    this.drawLine()
    this.drawText()
  }

  // 源数据从大到小排序
  getOriginalOrderData(source) {
    source.data.sort((a, b) => b.values[0] - a.values[0])

    // 排完序后，dimension的labels还需要处理
    source.dimension[0].labels = source.data.map((item) => item.dimensions[0])
  }

  /**
   * 每组线条
   */
  drawLine() {
    const {mainWidth} = this
    const [lineHeight, bgLineColor, gradientDirection] = ['lineHeight', 'bgLineColor', 'gradientDirection'].map((i) =>
      this.config(i)
    )

    if (gradientDirection === STATIC.GRADIENT_DIRECTION[0].key) {
      // this.colors = d3.schemeSet3// .slice(0, 2)
      this.colors = this.getColor(2)
      // 水平渐变
      this.drawLineColor()
    } else {
      this.colors = this.getColor(this._labels.length)
      // this.colors = d3.schemeSet3
    }

    // 绘制底部线
    this._itemsG.update('line.wave-bar-order-line-bg', {
      data: (d) => [d],
      attr: {
        x1: 0,
        y1: 0,
        x2: mainWidth,
        y2: 0,
        stroke: bgLineColor,
        'stroke-width': lineHeight,
      },
    })

    // 绘制代表数据的线
    this._itemsG.update('rect.wave-bar-order-line', {
      data: (d) => [d],
      enter: {
        style: {
          x: 0,
          y: -lineHeight / 2,
          width: 0,
          height: lineHeight,
          fill: (d) => {
            if (gradientDirection === STATIC.GRADIENT_DIRECTION[0].key) {
              return `url(#lineGradient${this._random})`
            }
            return this.colors[d.originIndex] || 'rgba(0,0,0,0)'
          },
        },
      },
      transitionAll: {
        style: {
          width: (d) => this._scaleX(d.data),
        },
      },
    })
  }

  /**
   * 文字部分
   */
  drawText() {
    const {mainWidth} = this
    const {
      // labelVisible,
      // labelSize,
      // labelColor,
      // gap,
      // valueVisible,
      // valueSize,
      // valueColor,
      // lineHeight,

      indexLength,
      percentVisible,
      iconVisible,
      iconHeight,
      iconWidth,
      iconX,
      iconY,
    } = this._option
    const [labelVisible, labelSize, labelColor, gap, valueVisible, valueSize, valueColor, lineHeight] = [
      'labelVisible',
      'labelSize',
      'labelColor',
      'gap',
      'valueVisible',
      'valueSize',
      'valueColor',
      'lineHeight',
    ].map((i) => this.config(i))

    if (!this._isWarn) {
      if (iconVisible) {
        // 绘制左侧icon
        this._itemsG.update('text.wave-gauge-iamge', {
          data: (d) => [d],
          attr: {
            'text-anchor2': 'start',
          },
        })
        this._itemsG.update('image', {
          data: (d) => [d],
          attr: {
            'xlink:href': (d) => d.icon.replace(/^http(s?):/, ''),
            width: iconWidth,
            height: iconHeight,
            x: -iconX,
            y: -iconY,
          },
        })
        // 绘制左侧标签文本
        labelVisible &&
          this._itemsG.update('text.wave-bar-order-label', {
            data: (d) => [d],
            text: (d) => {
              // const index = indexLength === 0 ? ''
              //   : indexLength === 1 ? String(d.originIndex + 1)
              //     : `0${String(d.originIndex + 1)}`
              const index =
                indexLength === 0 ? '' : indexLength === 1 ? String(d.originIndex + 1) : `${String(d.originIndex + 1)}`
              return d.data !== null ? `${index} ${d.label}` : ''
            },
            attr: {
              x: iconX + iconY,
              y: -2 * gap - lineHeight / 2,
              'text-anchor': 'start',
              'alignment-baseline': 'text-after-edge', // 相对于父元素对齐
              'font-size': this.fontSize(labelSize),
              fill: labelColor,
            },
          })
      } else {
        // 绘制左侧标签文本
        labelVisible &&
          this._itemsG.update('text.wave-bar-order-label', {
            data: (d) => [d],
            text: (d) => {
              const index =
                indexLength === 0 ? '' : indexLength === 1 ? String(d.originIndex + 1) : `${String(d.originIndex + 1)}`
              return d.data !== null ? `${index} ${d.label}` : ''
            },
            attr: {
              x: 0,
              y: -gap - lineHeight / 2,
              'text-anchor': 'start',
              'alignment-baseline': 'text-after-edge', // 相对于父元素对齐
              'font-size': this.fontSize(labelSize),
              fill: labelColor,
            },
          })
      }
    }
    let sum = 0
    let values = this._data.source.map((x) => x.value)
    values.forEach((x) => (sum += x))
    values = values.map((x) => `${String(((x / sum) * 100).toFixed(2))}%`)
    // let values = this._data.data.map(item => item.values[0])
    // values.forEach(item => sum += item)
    // values = values.map(x => `${String((x / sum * 100).toFixed(2))}%`)

    if (!this._isWarn) {
      if (percentVisible && valueVisible) {
        // 绘制右侧数值文本
        this._itemsG.update('text.wave-bar-order-value', {
          data: (d) => [d],
          text: (d) => (d.data !== null ? this.formatNumber(d.data) : ''),
          attr: {
            x: mainWidth - 100,
            y: -gap - lineHeight / 2,
            'text-anchor': 'end',
            'alignment-baseline': 'text-after-edge',
            'font-size': this.fontSize(valueSize),
            fill: valueColor,
          },
        })
        this._itemsG.update('text.wave-bar-order-percent', {
          data: (d) => [d],
          // eslint-disable-next-line no-undef
          text: (d) => xx[d.originIndex],
          // ((d.data !== null) ? this.formatNumber(d.data) : ''),
          attr: {
            x: mainWidth,
            y: -gap - lineHeight / 2,
            'text-anchor': 'end',
            'alignment-baseline': 'text-after-edge',
            'font-size': this.fontSize(valueSize),
            fill: valueColor,
          },
        })
      } else if (valueVisible) {
        // 绘制右侧数值文本
        this._itemsG.update('text.wave-bar-order-value', {
          data: (d) => [d],
          text: (d) => (d.data !== null ? this.formatNumber(d.data) : ''),
          attr: {
            x: mainWidth,
            y: -gap - lineHeight / 2,
            'text-anchor': 'end',
            'alignment-baseline': 'text-after-edge',
            'font-size': this.fontSize(valueSize),
            fill: valueColor,
          },
        })
      }
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
    const enableEnterAnimation = true
    const enterAnimationDuration = 1000
    const enterAnimationDelay = 500
    const enableLoopAnimation = false
    const loopAnimationDuration = 1000
    const loopAnimationDelay = 500
    const scrollAnimation =
      enableLoopAnimation &&
      new ScrollAnimation(
        {
          targets: '.wave-bar-order-item',
          clone: (node) => {
            // 想要滚动轮播动画最后“一行”连续，需要组件传入自定义追加元素的函数
            const newNode = node.cloneNode(true)
            node.parentNode.append(newNode)
            return newNode
          },
          delay: loopAnimationDelay,
          duration: loopAnimationDuration,
          offsetY: (this._scaleY.range()[1] - this._scaleY.range()[0]) / (this.config('maxRow') - 1),
        },
        this
      )
    const scrollContainerAnimation =
      enableLoopAnimation &&
      new ScrollAnimation(
        {
          targets: '.event-container',
          clone: (node) => {
            // 想要滚动轮播动画最后“一行”连续，需要组件传入自定义追加元素的函数
            const newNode = node.cloneNode(true)
            node.parentNode.append(newNode)
            // 事件
            const data = d3.select(node).data()
            d3.select(newNode)
              .on('mouseover', (d, i, elms) => d3.select(node).on('mouseover').call(node, data[i], i, elms))
              .on('mouseout', (d, i, elms) => d3.select(node).on('mouseout').call(node, data[i], i, elms))
              .on('mousemove', (d, i, elms) => d3.select(node).on('mousemove').call(node, data[i], i, elms))
              .on('click', (d, i, elms) => d3.select(node).on('click').call(node, data[i], i, elms))
            return newNode
          },
          delay: loopAnimationDelay,
          duration: loopAnimationDuration,
          offsetY: (this._scaleY.range()[1] - this._scaleY.range()[0]) / (this.config('maxRow') - 1),
          hide: true,
        },
        this
      )
    // 由于 scroll 传入 clone 会生成新节点，所以出场动画实例需要在后面生成
    const zoomAnimation = new ZoomAnimation(
      {
        targets: '.wave-bar-order-line',
        delay: enterAnimationDelay,
        duration: enterAnimationDuration,
        type: 'enlarge',
        direction: 'both',
        loop: false,
      },
      this
    )
    const fadeAnimation = new FadeAnimation(
      {
        targets: '.wave-bar-order-label, .wave-bar-order-value',
        duration: enterAnimationDuration,
        type: 'fadeIn',
        loop: false,
      },
      this
    )

    enableEnterAnimation && this.root.selectAll('.wave-bar-order-label, .wave-bar-order-value').style('opacity', 0)
    if (enableEnterAnimation && enableLoopAnimation) {
      zoomAnimation.event.on('start', () => fadeAnimation.play())
      fadeAnimation.event.on('end', () => {
        this.ready()
        scrollAnimation.play()
        scrollContainerAnimation.play()
      })
      zoomAnimation.play()
    } else if (enableEnterAnimation) {
      zoomAnimation.event.on('start', () => fadeAnimation.play())
      zoomAnimation.event.on('end', () => this.ready())
      zoomAnimation.play()
    } else if (enableLoopAnimation) {
      this.ready()
      scrollAnimation.play()
      scrollContainerAnimation.play()
    } else {
      this.ready()
    }

    // tooltip 动画处理
    this.loopTooltip(this.root.selectAll('.event-container'))

    return this
  }

  _clearTimer() {
    timer.clear(this.timer)
    timer.clearKey(this.uuid)
  }

  destroy() {
    // 清除定时器
    this._clearTimer()
    this.container.html('')
  }
}

BarOrder.version = '__VERSION__'
