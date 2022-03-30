import * as d3 from 'd3'
import Base from '../base'
import {dataUtil, formatMoney} from '../util'
import {ScanAnimation, FadeAnimation, ZoomAnimation} from '../base/animation'

const {drawLabelAxisY, getTextHeight, getTextWidth} = Base

const STATIC = {
  ORDER: [
    {
      key: 'MAX_MIN',
      value: '大到小',
    },
    {
      key: 'MIN_MAX',
      value: '小到大',
    },
    {
      key: 'DEFAULT',
      value: '默认',
    },
  ],
  DIRECTION: [
    {
      key: 'HORIZONTAL',
      value: '横向',
    },
    {
      key: 'VERTICAL',
      value: '纵向',
    },
  ],
}

const defaultOption = {
  order: STATIC.ORDER[0].key,
  waveXTickSize: 12,
  waveXTickColor: 'rgba(255, 255, 255, 0.65)',
  waveTickCount: 5,
  labelSize: 12,
  labelColor: 'rgba(255, 255, 255, 0.65)',
  labelGap: 6,
  direction: STATIC.DIRECTION[0].key,
  waveTickOpacity: 0.2,
  groupBarGap: 0,
  barWidth: null,
  valueVisible: false,
  valueColor: 'rgba(255, 255, 255, 0.65)',
  valueSize: 12,
  barGap: 0,
  _type: 'canLayout',

  labelKey: 'label',
  valueKey: 'value',
  contrastKey: 'contrast',
}

export default class Pyramid extends Base {
  static key = 'pyramid'

  // 根据图表方向获取对于的值
  _getValue = (a, b) => {
    return this._horizontal ? a : b
  }

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    // X轴的值范围
    this._axisXValue = 0
    // X轴刻度文本与顶部填充
    this._axisPadding = 6
    // 根据图表方向获取对于的值
    this._getValue = (a, b) => {
      return this._horizontal ? a : b
    }
    this.root.attr('class', 'wave-pyramid')
    this._horizontal = this.config('direction') === STATIC.DIRECTION[0].key

    this.drawLabelAxisY = drawLabelAxisY
    this.getTextHeight = getTextHeight
    this.getTextWidth = getTextWidth
    this.formatMoney = (d) => {
      return this._isWarn ? '' : formatMoney(d)
    }
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(source) {
    // 校验数据格式是否合法 - 可根据图表自行更改
    let legendsLabels = ['', '']
    try {
      if (source) {
        this._data.source = source
      } else {
        throw new Error('')
      }
      legendsLabels = [source.valueKey.name, source.contrastKey.name]
    } catch (err) {
      console.error('Data format error')
      throw new Error('数据结构错误')
    }

    // 转换数据为老的格式（未来有时间要干掉优化）
    source = dataUtil.transform([this.config('labelKey')], [[source.valueKey.tag, source.contrastKey.tag]], source.data)

    const labelGap = this.config('labelGap')
    const waveXTickSize = this.config('waveXTickSize')
    const order = this.config('order')
    const labelSize = this.config('labelSize')
    const {ORDER} = STATIC
    const data = dataUtil.classify(source)[0].labels

    let labelLength = 0

    // 统计最长的label
    data.forEach((d) => {
      labelLength = Math.max(this.getTextWidth(d.label, labelSize), labelLength)
    })

    // 中间总间距
    const centerGap = labelLength + labelGap * 2

    // 最大值
    this._data.maxValue = dataUtil.assembleValueRange([{labels: data}], source)[source.unit[0]][1]

    // 最大值在格式化后的长度？
    this._data.maxValueLength = this.getTextWidth(this.formatMoney(this._data.maxValue), waveXTickSize) / 2

    // 如果是纵向那么需要将X轴 的x位置偏移
    this._data.axisX = this._getValue(0, this._data.maxValueLength * 2 + 12)

    // 标签排序
    // 三文：dataUtil.classify 这个旧方法会将转换后的数据格式进行排序重组，太难理解，这里专门为了不排序的功能添加以下代码功能
    if (order === ORDER[2].key) {
      const labels = this._data.source.data.map(({label}) => label)
      this._data.data = labels.map((label) => data.find((item) => item.label === label))
    } else {
      this._data.data =
        order === ORDER[0].key
          ? data.sort((a, b) => d3.sum(b.total) - d3.sum(a.total))
          : data.sort((a, b) => d3.sum(a.total) - d3.sum(b.total))
    }

    // 颜色
    // 金字塔颜色固定两个
    this._data.color = this.getColor([])

    // 图例

    this._data.legends = source.valueDescription.map((v, i) => {
      return {
        label: legendsLabels[i],
        color: this._data.color[i],
      }
    })

    this._data.labelLength = labelLength
    this._data.centerGap = centerGap
    this._data.labels = this._data.data.map((d) => d.label)
    return this
  }

  /**
   * 绘制图表和处理所有不可变的内容
   * 不可变 - 比如绘制图表的框架结构、计算一些数据发生改变但是不会被影响的内容
   * @return {object} 图表实例
   */
  draw({redraw}) {
    if (redraw === true) {
      this.root.attr('opacity', 1)
      this.root.html('')
    }
    if (!this._data.source) {
      console.error('Data cannot be empty')
      return
    }

    // 图例
    !this._isWarn && this.drawLegends({legends: this._data.legends})

    // X轴
    this._xaxis = this.container.select('svg').append('g').attr('class', 'wave-axis-x')

    // 主体
    this._content = this.root.append('g')

    // 下边还是左边?
    const titleUnitHeight = this.config('titleHeight') + this.config('unitHeight')
    if (this._horizontal) {
      // 如果是水平方向那么将X轴放在最底部
      this._xaxis.attr(
        'transform',
        `translate(${this.padding[3]}, ${
          this.mainHeight + this.padding[0] + this.config('barGap') + (this.isDev ? titleUnitHeight : 0)
        })`
      )
    } else {
      // 如果是纵向那么将X轴放在最左边 但是要将轴进行右偏移
      this._xaxis.attr(
        'transform',
        `translate(${this._data.axisX + this.config('barGap')}, ${
          this.padding[0] + (this.isDev ? titleUnitHeight : 0)
        })`
      )
    }

    // 更新图表
    this.update()

    // 入场动画
    this._isWarn || this.animation()
    // 容错处理
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    // return this
  }

  /**
   * 图表更新
   * 在计算好可变（data）和不可变（draw）后可以利用计算的结果来绘制和更新图表了
   * @return {object} 图表实例
   */
  update() {
    const groupBarGap = this.config('groupBarGap')
    const customizeBarWidth = this.config('barWidth')
    const valueVisible = this.config('valueVisible')
    const valueColor = this.config('valueColor')
    const valueSize = this.fontSize(this.config('valueSize'))
    const labelSize = this.fontSize(this.config('labelSize'))
    const labelColor = this.config('labelColor')
    const valuePosition = this.config('valuePosition')
    const valueShadowVisible = this.config('valueShadowVisible')
    const valueShadowColor = this.config('valueShadowColor')
    const valueShadowOffset = this.config('valueShadowOffset')
    const tooltipEventType = this.config('tooltipEventType')
    const tooltipVisible = this.config('tooltipVisible')
    const {data, color, centerGap, maxValueLength, labels} = this._data

    // 柱子宽度
    const barWidth = customizeBarWidth || this._getValue(this.mainHeight, this.mainWidth) / 20

    // 柱子的最大长度
    // 应该是图表最大宽度减去 最长标签 减去 标签首尾间距
    // 图表不受标签首尾间距影响
    this._barLength = (this._getValue(this.mainWidth, this.mainHeight) - centerGap) / 2 // - maxValueLength

    // y轴 (每个标签的位置)
    const scaleY = d3
      .scalePoint()
      .range([this._getValue(this.mainHeight - barWidth, 0), this._getValue(0, this.mainWidth - barWidth)])
      .domain(labels)
      .padding(groupBarGap)

    // X轴
    this.drawAxis()

    // 第一列柱子的起始位置
    const s1 = this._scale[0](0) + maxValueLength - maxValueLength
    // 第二列柱子起始位置
    const s2 = this._barLength + centerGap

    // 获取每一列容器的位置
    const getItemCoordinate = this._getValue(
      (d) => {
        return `translate(0, ${scaleY(d.label)})`
      },
      (d) => {
        return `translate(${scaleY(d.label)}, 0)`
      }
    )

    // 获取柱子宽高
    const getBarSize = this._getValue(
      {
        width: (d, i, elms) => {
          elms[i].size = i === 0 ? this._barLength - this._scale[i](d) : this._scale[i](d)
          return elms[i].size
        },
        height: barWidth,
      },
      {
        width: barWidth,
        height: (d, i, elms) => {
          elms[i].size = i === 0 ? this._barLength - this._scale[i](d) : this._scale[i](d)
          return elms[i].size
        },
      }
    )

    // 获取柱子的旋转角度
    const getBarRotate = this._getValue(
      (d, i) => {
        return i === 0 ? 'rotateY(180deg)' : 'none'
      },
      (d, i) => {
        return i === 0 ? 'rotateX(180deg)' : 'none'
      }
    )

    // 获取柱子的位置
    const getBarCoordinate = this._getValue(
      {
        x: (d, i) => (i === 0 ? 0 - s1 : s2),
      },
      {
        y: (d, i) => (i === 0 ? 0 - s1 : s2),
      }
    )

    // 获取标签位置
    const getLabelCoordinate = this._getValue(
      {
        dx: s1 + centerGap / 2,
        dy: barWidth / 2 + labelSize * 0.05,
        'dominant-baseline': 'middle',
        'text-anchor': 'middle',
      },
      {
        dx: s1 + centerGap / 2,
        dy: 0 - barWidth / 2 + labelSize * 0.06,
        'dominant-baseline': 'middle',
        'text-anchor': 'middle',
        transform: 'rotate(90)',
      }
    )

    // 获取数值位置
    const getValueCoordinate = this._getValue(
      {
        dx: (d, i) => {
          // 第一列和第二列柱子的位置不一样
          const insidePosition = i === 0 ? s1 - (this._barLength - this._scale[i](d)) : s2 + this._scale[i](d)
          if (valuePosition === 'inside') {
            return insidePosition
          }
          return insidePosition + getTextWidth(this.numberFormat(d), valueSize) * (i === 0 ? -1.1 : 1.1)
        },
        dy: barWidth / 2 + labelSize * 0.05,
        'dominant-baseline': 'middle',
        'text-anchor': (d, i) => (i === 0 ? 'start' : 'end'),
      },
      {
        dx: (d, i) => {
          // 第一列和第二列柱子的位置不一样
          const insidePosition = i === 0 ? s1 - (this._barLength - this._scale[i](d)) : s2 + this._scale[i](d)
          if (valuePosition === 'inside') {
            return insidePosition
          }
          return insidePosition + getTextWidth(this.numberFormat(d), valueSize) * (i === 0 ? -1.1 : 1.1)
        },
        dy: 0 - barWidth / 2 + labelSize * 0.05,
        'dominant-baseline': 'middle',
        'text-anchor': (d, i) => (i === 0 ? 'start' : 'end'),
        transform: 'rotate(90)',
      }
    )

    // 更新
    this._content

      // 每一列容器
      .update('g.wave-pyramid-item', {
        data,
        dataKey: (d) => d.label,

        enter: {
          attr: {
            transform: getItemCoordinate,
          },
        },
        transitionUpdate: {
          attr: {
            transform: getItemCoordinate,
          },
        },
      })

      // 柱子
      .update('rect.wave-pyramid-bar', {
        data: (d) => d.total,

        enter: {
          style: {
            ...getBarCoordinate,
            ...getBarSize,
            transform: getBarRotate,
            fill: (d, i) => color[i],
          },
        },

        transitionAll: {
          style: {
            ...getBarSize,
          },
        },
      })

      // 标签
      .upper()
      .update('text.wave-pyramid-label', {
        data: (d) => [d.label],

        enter: {
          attr: {
            ...getLabelCoordinate,
            fill: labelColor,
            'font-size': labelSize,
          },
          text: (d) => (this._isWarn ? '' : d),
        },
      })

      // 数值
      .upper()
      .update('text.wave-pyramid-value', {
        data: valueVisible ? (d) => d.total : null,

        enter: {
          attr: {
            ...getValueCoordinate,
            fill: valueColor,
            'font-size': valueSize,
          },
          style: {
            'text-shadow': valueShadowVisible
              ? `${valueShadowOffset[0]}px ${valueShadowOffset[1]}px ${valueShadowOffset[2]}px ${valueShadowColor}`
              : '',
          },
        },
        attr: {
          ...getValueCoordinate,
        },
        text: (d, i) => {
          if (this._isWarn) {
            return ''
          }
          // 如果文本大于柱子长度那么不显示值
          const vl = this.getTextWidth(d, this.config('valueSize'))
          const barSize = i === 0 ? this._barLength - this._scale[i](d) : this._scale[i](d)
          return vl > barSize ? '' : this.numberFormat(d)
        },
      })

    this._eventContainer = this.root.append('g').attr('class', 'wave-pyramid-event')
    // 用来交互的容器，先放在最底层
    const _labelsLength = this._data.labels.length
    const _labelGap = _labelsLength === 1 ? this.mainHeight : this.mainHeight / (_labelsLength - 1)
    this._eventContainer
      .selectAll('.wave-pyramid-event')
      .data(this._data.labels)
      .enter()
      .append('rect')
      .attr('class', 'wave-pyramid-event-item')
      .attr('stroke', '#fff')
      .attr('fill', 'black')
      .attr('stroke-opacity', '0.3')
      .attr('y', (d, i) => scaleY(this._data.labels[i]) - _labelGap / 2)
      .attr('x', 0)
      .attr('height', _labelGap)
      .attr('width', this.mainWidth)
      .style('opacity', '0')
      .on('mouseover', (d, i, elms) => {
        if (tooltipVisible) {
          d3.select(elms[i]).transition().style('opacity', '0.3')
        }
      })
      .on('click', (d, i) => {
        const list = [
          {
            key: this._data.source.valueKey.name,
            value: this._data.data[i].total[0],
            color: this._data.color[0],
          },
          {
            key: this._data.source.contrastKey.name,
            value: this._data.data[i].total[1],
            color: this._data.color[1],
          },
        ]
        const tooltipData = {title: d, list, ...this.tooltipPosition}
        if (tooltipVisible && (tooltipEventType === 'click' || this.config('enableLoopTooltip'))) {
          this.tooltip.show(tooltipData)
        }
        this.event.fire('groupRectClick', {data: tooltipData, e: d3.event})
      })
      .on('mousemove', (d, i) => {
        const list = [
          {
            key: this._data.source.valueKey.name,
            value: this._data.data[i].total[0],
            color: this._data.color[0],
          },
          {
            key: this._data.source.contrastKey.name,
            value: this._data.data[i].total[1],
            color: this._data.color[1],
          },
        ]
        const tooltipData = {title: d, list}
        if (tooltipVisible && tooltipEventType === 'hover') {
          this.tooltip.show(tooltipData)
        }
        // this.event.fire(tooltipData)
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
    const enterAnimationDelay = 500
    const enableLoopAnimation = false
    const loopAnimationDuration = 2000
    const loopAnimationDelay = 500
    const scanColor = 'RGBA(255, 255, 255, 0.4)'
    const zoomAnimation = new ZoomAnimation(
      {
        targets: '.wave-pyramid-bar',
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
        targets: '.wave-pyramid-value',
        duration: enterAnimationDuration * 0.3,
        type: 'fadeIn',
        loop: false,
      },
      this
    )
    const scanAnimation = new ScanAnimation(
      {
        targets: '.wave-pyramid-bar',
        delay: loopAnimationDelay,
        duration: loopAnimationDuration,
        direction: 'right',
        color: scanColor,
        loop: true,
      },
      this
    )

    enableEnterAnimation && this.root.selectAll('.wave-pyramid-value').style('opacity', 0)
    if (enableEnterAnimation && enableLoopAnimation) {
      zoomAnimation.event.on('end', () => fadeAnimation.play())
      fadeAnimation.event.on('end', () => {
        this.ready()
        scanAnimation.play()
      })
      scanAnimation.event.on('end', () => {})
      zoomAnimation.play()
    } else if (enableEnterAnimation) {
      zoomAnimation.event.on('end', () => fadeAnimation.play())
      fadeAnimation.event.on('end', () => {
        this.ready()
      })
      zoomAnimation.play()
    } else if (enableLoopAnimation) {
      this.ready()
      scanAnimation.event.on('end', () => {})
      scanAnimation.play()
    } else {
      this.ready()
    }

    // tooltip 动画处理
    this.loopTooltip(this._eventContainer.selectAll('.wave-pyramid-event-item'))

    return this
  }

  /**
   * 绘制X轴
   * 这东西估计早晚要提取出来封装通用的.....
   */
  drawAxis() {
    // 先看看范围值一样不 不一样才重绘
    if (this._axisXValue === this._data.maxValue) {
      return this
    }

    // 重绘前先清除X轴
    this._xaxis.selectAll('g').remove()
    this._axisXValue = this._data.maxValue

    const waveXTickSize = this.fontSize(this.config('waveXTickSize'))
    const waveXTickColor = this.config('waveXTickColor')
    const waveTickCount = this.config('waveTickCount')
    const waveTickOpacity = this.config('waveTickOpacity')

    // 格式化刻度
    const tickFormat = (v) => {
      return this.formatMoney(v)
    }

    // 储存x轴两边的比例尺
    this._scale = [
      d3.scaleLinear().range([0, this._barLength]).domain([this._data.maxValue, 0]),
      d3.scaleLinear().range([0, this._barLength]).domain([0, this._data.maxValue]),
    ]

    const axis = []
    const translate = []

    // 水平
    if (this._horizontal) {
      // 分隔线
      this._xaxis
        .append('g')
        .append('line')
        .attr('x1', 0)
        .attr('x2', this.mainWidth)
        .attr('stroke', `rgba(255,255,255, ${waveTickOpacity})`)
      axis[0] = d3.axisBottom(this._scale[0]).ticks(waveTickCount).tickFormat(tickFormat).tickPadding(this._axisPadding)
      axis[1] = d3.axisBottom(this._scale[1]).ticks(waveTickCount).tickFormat(tickFormat).tickPadding(this._axisPadding)
      translate[0] = `translate(${this._data.maxValueLength}, 0)`
      translate[1] = `translate(${this.mainWidth - this._barLength - this._data.maxValueLength}, 0)`
    } else {
      // 分隔线
      this._xaxis
        .append('g')
        .append('line')
        .attr('y1', 0)
        .attr('y2', this.mainHeight)
        .attr('stroke', `rgba(255,255,255, ${waveTickOpacity})`)
      axis[0] = d3.axisLeft(this._scale[0]).ticks(waveTickCount).tickFormat(tickFormat).tickPadding(this._axisPadding)
      axis[1] = d3.axisLeft(this._scale[1]).ticks(waveTickCount).tickFormat(tickFormat).tickPadding(this._axisPadding)
      translate[0] = `translate(0, ${this._data.maxValueLength})`
      translate[1] = `translate(0, ${this.mainHeight - this._barLength - this._data.maxValueLength})`
    }

    // 左边X轴
    this._isWarn ||
      this._xaxis
        .append('g')
        .attr('transform', translate[0])
        .call((g) => {
          g.call(axis[0])
          g.select('.domain').remove()
          g.selectAll('.tick text')
            .attr('class', 'wave-xaxis')
            .attr('font-size', waveXTickSize)
            .attr('fill', waveXTickColor)
          g.selectAll('.tick line').attr('opacity', waveTickOpacity)
        })

    // 右边X轴
    this._isWarn ||
      this._xaxis
        .append('g')
        .attr('transform', translate[1])
        .call((g) => {
          g.call(axis[1])
          g.select('.domain').remove()
          g.selectAll('.tick text')
            .attr('class', 'wave-xaxis')
            .attr('font-size', waveXTickSize)
            .attr('fill', waveXTickColor)
          g.selectAll('.tick line').attr('opacity', waveTickOpacity)
        })
  }
}

Pyramid.version = '__VERSION__'
