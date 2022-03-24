import * as d3 from 'd3'
import Base from '../base'
import {dataUtil, hexToRgb} from '../util'
import {RippleAnimation} from '../base/animation'
import fallbackData from './fallback-data'

const {drawAxisX, drawAxisY, formatMoney, getTextHeight, getTextWidth, drawTitle, drawUnit} = Base

const STATIC = {
  REGION_TYPE: [
    {
      key: 'HIGH',
      value: '高点',
    },
    {
      key: 'LOW',
      value: '低点',
    },
    {
      key: 'ALL',
      value: '所有',
    },
  ],
}

const defaultOption = {
  lineColor: 'rgba(255,255,255,0.3)',
  // 点的大小
  pointSize: 10,
  averageLine: true,
  averageContent: '平均值',
  averageValue: null,
  // 是否显示数值
  showItemTarget: true,

  regionType: 'ALL',
  regionOpacity: 0.35,
  regionVisible: true,
  valueType: 'label',
  valueSize: 12,
  valueColor: 'rgba(255, 255, 255, 0.65)',
  // 线颜色
  averageLineColor: 'rgba(255,255,255,0.5)',

  axisXKey: 'x',
  highKey: 'high',
  lowKey: 'low',
  _type: 'canLayout',
}

export default class HighLow extends Base {
  static key = 'highLow'

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    this.root.attr('class', 'wave-high-low')

    this.drawAxisX = drawAxisX
    this.drawAxisY = drawAxisY
    this.formatMoney = formatMoney
    this.getTextHeight = getTextHeight
    this.formatNumber = this.numberFormat
    this.getTextWidth = getTextWidth
    this.drawTitle = drawTitle
    this.drawUnit = drawUnit
  }

  drawFallback() {
    this.root.attr('opacity', 0.5)
    this.data(fallbackData)
    this.draw({redraw: false})
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(data) {
    // 新加一个变量判断是哪种数据结构
    this.dataRule = 'old'
    // 此处做一个兼容，后续干掉前一种数据结构
    let highLowKeyList = [this.config('highKey'), this.config('lowKey')]
    let legendsName = []
    if (Object.prototype.toString.call(data) === '[object Object]') {
      highLowKeyList = [data.highKey.id, data.lowKey.id]
      legendsName = [data.highKey.name, data.lowKey.name]
      this.dataRule = 'new'
      data = data.data
    }

    // 校验数据格式是否合法 - 可根据图表自行更改
    try {
      if (data.length > 0) {
        this._data.source = data
      } else {
        throw new Error('')
      }
    } catch (err) {
      console.error('Data format error')
      throw new Error('数据结构错误')
    }

    // 转换数据为老的格式（未来有时间要干掉优化）
    const source = dataUtil.transform([this.config('axisXKey')], [highLowKeyList], data)

    const regionVisible = this.config('regionVisible')
    const regionType = this.config('regionType')
    const averageLine = this.config('averageLine')
    const averageContent = this.config('averageContent')
    const averageLineColor = this.config('averageLineColor')

    // 将数据分类
    this._data.data = dataUtil.classify(source, true)[0].labels

    // 获取X轴标签
    this._data.labels = this._data.data.map((d) => d.label)

    // 按照值的个数取色
    // const colors = d3.schemeSet3
    const colors = this.getColor(source.valueDescription.length)
    this._data.data.forEach((d) => {
      d.v = d.data[0].values.map((v, i) => ({v, c: colors[i]}))
    })

    // 图例 - 图例按照值的描述个数表示
    this._data.legends = source.valueDescription.map((v, i) => ({
      label: this.dataRule === 'new' ? legendsName[i] : v,
      color: this._data.data[0].v[i].c,
    }))

    // 获取最大数值
    this._data.maxValue = dataUtil.maxValue(source, source.maxValue)[source.unit[0]]
    this._data.minValue = d3.min(source.data.map((x) => x.values[0]).concat(source.data.map((x) => x.values[1])))

    // 最大值还得考虑到用户配置的平均值
    const averageValue = this.config('averageValue') || (this._data.maxValue + this._data.minValue) / 2
    this._data.maxValue = Math.max(this._data.maxValue, averageValue)

    // X轴
    this._scaleX = this.baseDrawAxisX({
      rangeValue: this.mainWidth,
      domain: this._data.labels,
      barWidth: this.config('pointSize'),
    }).scale

    // 创建Y轴
    const offset = (this._data.maxValue - this._data.minValue) * 0.05
    this._scaleY = this.baseDrawAxisY({domainL: [this._data.minValue - offset, this._data.maxValue + offset]}).scaleYL

    // 看看显示什么区域
    if (regionVisible) {
      this._data.region = []
      if (regionType === STATIC.REGION_TYPE[0].key || regionType === STATIC.REGION_TYPE[2].key) {
        this._data.region.push({
          vs: this._data.data.map((d) => [this._scaleX(d.label), this._scaleY(d.v[0].v)]),
          key: source.valueDescription[0],
          id: 'wave-high-low-region-high',
        })
      }
      if (regionType === STATIC.REGION_TYPE[1].key || regionType === STATIC.REGION_TYPE[2].key) {
        this._data.region.push({
          vs: this._data.data.map((d) => [this._scaleX(d.label), this._scaleY(d.v[1].v)]),
          key: source.valueDescription[1],
          id: 'wave-high-low-region-low',
        })
      }
    }

    // 将均线值的描述配置到图例中
    if (averageLine) {
      this._data.legends.push({
        label: averageContent || '平均值',
        color: averageLineColor,
      })
    }
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

    !this._isWarn && this.drawLegends({legends: this._data.legends})

    const averageLine = this.config('averageLine')
    const averageValue = this.config('averageValue') || (this._data.maxValue + this._data.minValue) / 2
    // const averageLineColor = this.config('averageLineColor')
    const regionVisible = this.config('regionVisible')
    const regionType = this.config('regionType')
    const regionOpacity = this.config('regionOpacity')
    // TODO: 颜色被写死，待修订
    const highColor = `rgba(100,200,100,${regionOpacity})`
    const lowColor = `rgba(100,50,200,${regionOpacity})`

    // const highColor = (this._data.data[0].v[0].c).replace('#','')
    // const lowColor = this._data.data[0].v[1].c

    // 点容器
    this._pointContainer = this.root.append('g').attr('class', 'wave-high-low-points')

    // 区域容器
    this._regionContainer = this.root.append('g').attr('class', 'wave-high-low-regions')

    // 如果显示区域那么先创建好区域的渐变层
    if (regionVisible) {
      this._areaGenerator = d3.area().y0(this.mainHeight)
      const defs = this._regionContainer.append('defs')
      if (regionType === STATIC.REGION_TYPE[0].key || regionType === STATIC.REGION_TYPE[2].key) {
        const linearGradient = defs
          .append('linearGradient')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 0)
          .attr('id', 'wave-high-low-region-high')
          .attr('y2', '110%')

        linearGradient.append('stop').attr('offset', '0%').style('stop-color', hexToRgb(highColor, regionOpacity))
        linearGradient.append('stop').attr('offset', '100%').style('stop-color', hexToRgb(highColor, 0))
      }

      if (regionType === STATIC.REGION_TYPE[1].key || regionType === STATIC.REGION_TYPE[2].key) {
        const linearGradient = defs
          .append('linearGradient')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', 0)
          .attr('id', 'wave-high-low-region-low')
          .attr('y2', '110%')

        linearGradient.append('stop').attr('offset', '0%').style('stop-color', hexToRgb(lowColor, regionOpacity))
        linearGradient.append('stop').attr('offset', '100%').style('stop-color', hexToRgb(lowColor, 0))
      }
    }

    // 更新图表
    this.update()

    // 如果显示均线
    if (averageLine) {
      const y = this._scaleY(averageValue)
      this.root
        .append('line')
        .attr('y1', y)
        .attr('y2', y)
        .attr('x1', 0)
        .attr('x2', this.mainWidth)
        .style('stroke', this.config('averageLineColor'))
        .style('stroke-width', '2')
        .style('stroke-dasharray', '5 , 5')
    }

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
    const lineColor = this.config('lineColor')
    const pointSize = this.config('pointSize')
    const showItemTarget = this.config('showItemTarget')
    const valueColor = this.config('valueColor')
    const valueSize = this.fontSize(this.config('valueSize'))
    // const regionType = this.config('regionType')
    const time = this.config('updateDuration')
    // const regionVisible = this.config('regionVisible')
    const lineWidth = 1

    // const {labels, data, region} = this._data
    const {data, region} = this._data

    // 是否显示更新动画
    const animation = this.config('updateAnimation') ? `transform ${time / 1000}s` : 'none'

    const getHeight = (v) => 0 - (this.mainHeight - this._scaleY(v))

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    // 更新区域
    this._regionContainer.update('path.wave-high-low-region', {
      data: region,
      dataKey: (d) => d.key,

      enter: {
        attr: {
          d: (d) => this._areaGenerator(d.vs),
          fill: (d) => `url(#${d.id})`,
          'transform-origin': 'bottom',
        },
      },
      transitionAll: {
        attr: {
          d: (d) => this._areaGenerator(d.vs),
        },
      },
    })

    // 更新高低点
    this._pointContainer
      .update('g.wave-high-low-item', {
        data,
        dataKey: (d) => d.label,

        style: {
          transform: (d) => `translate(${this._scaleX(d.label)}px, ${this.mainHeight}px)`,
          transition: animation,
        },
      })

      // 连线
      .update('rect.wave-high-low-point-line', {
        data: (d) => [d.v],

        enter: {
          attr: {
            fill: lineColor,
            height: 0,
            width: lineWidth,
            y: (d) => getHeight(d[0].v > d[1].v ? d[0].v : d[1].v),
          },
        },
        transitionAll: {
          attr: {
            height: (d) => Math.abs(getHeight(d[0].v) - getHeight(d[1].v)),
            y: (d) => getHeight(d[0].v > d[1].v ? d[0].v : d[1].v),
          },
        },
      })

      // 节点
      .upper()
      .update('circle.wave-high-low-point', {
        data: (d) => d.v,

        enter: {
          attr: {
            r: 0,
            cy: (d) => getHeight(d.v),
            fill: (d) => d.c,
          },
        },

        transitionAll: {
          attr: {
            r: pointSize,
            cy: (d) => getHeight(d.v),
          },
        },
      })

      // 更新值
      .upper()
      .update('text.wave-high-low-value', {
        data: showItemTarget ? (d) => d.v : null,

        enter: {
          attr: {
            fill: valueColor,
            'font-size': valueSize,
            'text-anchor': 'middle',
            dy: '-0.9em',
          },
        },
        all: {
          attr: {
            y: (d) => getHeight(d.v),
          },
        },
        text: (d) => (this._isWarn ? '' : this.formatNumber(d.v)),
      })

    return this
  }

  /**
   * 图表动画
   * 这里仅处理入场动画和轮播动画
   * @return {object} 图表实例
   */
  animation() {
    const pointSize = this.config('pointSize')
    // 动画开关控制
    const enableEnterAnimation = this.config('enableEnterAnimation')
    // 动画时间
    const enterAnimationDuration = this.config('enterAnimationDuration')
    // 轮播动画
    const enableLoopAnimation = this.config('enableLoopAnimation')
    // 轮播动画
    const loopAnimationDuration = this.config('loopAnimationDuration')
    // 轮播延时
    const loopAnimationDelay = this.config('loopAnimationDelay')

    if (enableLoopAnimation) {
      this.rippleAnimation = new RippleAnimation(
        {
          targets: this._pointContainer.selectAll('.wave-high-low-point'),
          delay: loopAnimationDelay,
          duration: loopAnimationDuration,
          scale: 2.3,
          loop: true,
        },
        this
      )
    }

    if (enableEnterAnimation) {
      this._pointContainer
        .selectAll('.wave-high-low-point')
        .setAnimation({
          attr: {
            r: pointSize,
          },
          duration: enterAnimationDuration,
        })
        .upper()
        .selectAll('.wave-high-low-value')
        .setAnimation({
          attr: {
            opacity: 1,
          },
          // 值的入场动画在柱子和折线动画完成之后 所以他需要等待一会
          delay: enterAnimationDuration,
          duration: enterAnimationDuration,
          onEnd: () => {
            // 动画结束后将组建状态设置为就绪
            this.ready()
            enableLoopAnimation && this.rippleAnimation.play()
          },
        })

      this._regionContainer.selectAll('.wave-high-low-region').setAnimation({
        style: {
          transform: {from: 'scale(1, 0)', to: 'scale(1, 1)'},
        },
        duration: enterAnimationDuration,
      })
    } else {
      // 关闭动画
      // .....
      enableLoopAnimation && this.rippleAnimation.play()

      // 更改图表状态为就绪
      this.ready()
    }

    return this
  }
}

HighLow.version = '__VERSION__'
