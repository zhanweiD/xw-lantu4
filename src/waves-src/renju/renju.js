import * as d3 from 'd3'
import Base from '../base'
import {dataUtil, dataTransformFor111, computePercent, getTextHeight} from '../util'
import {RippleAnimation} from '../base/animation'
// import {renjuData} from './fallback'

const {createUuid, drawTitle, drawUnit} = Base

export const STATIC = {
  VALUE_TYPE: [
    {
      key: 'SCALE',
      value: '按比例',
    },
    {
      key: 'REAL',
      value: '实际值',
    },
  ],
}

const defaultOption = {
  enableGradient: true,
  circleOpacity: 1,
  circleMaxRadius: null,
  labelSize: 12,
  labelColor: 'rgba(255, 255, 255, 0.65)',
  labelAngle: 0,
  valueType: STATIC.VALUE_TYPE[1].key,
  valueSize: 12,
  valueColor: 'rgba(255, 255, 255, 0.65)',
  valueOffsetY: 0,
  lineColor: '#fff',
  lineOpacity: 0.4,
  labelOffsetY: 0,

  labelKey: 'label',
  valueKey: 'value',
  _type: 'canLayout',
}

export default class Renju extends Base {
  static key = 'renju'

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    this.root.attr('class', 'wave-renju')

    this._id = createUuid()
    this._gradientIdPrefix = `wave-renju-gradient-${this._id}`
    this.formatNumber = this.numberFormat
    this.drawTitle = drawTitle
    this.drawUnit = drawUnit
    this.getTextHeight = getTextHeight
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(_data) {
    // 校验数据格式是否合法 - 可根据图表自行更改
    try {
      if (_data.length > 0) {
        this._data.source = _data
      } else {
        throw new Error('')
      }
    } catch (err) {
      console.error('Data format error')
      throw new Error('数据结构错误')
    }

    // 转换数据为老的格式（未来有时间要干掉优化）
    const source = dataUtil.transform(['label'], [['value']], _data)
    // 可变的计算
    const data = dataTransformFor111(source)

    const {datas} = data

    const maxValues = dataUtil.maxValue(source, source.maxValue)
    this._maxValue = maxValues[source.unit[0]]

    if ('SCALE' === STATIC.VALUE_TYPE[0].key) {
      // 计算百分比
      const percents = computePercent(datas, (d) => d.value, 1)
      datas.forEach((d, i) => (d.percent = percents[i]))
    }
    const flag = true
    if (flag) {
      // 如果开启渐变，那么需要多一个颜色
      this._colors = this.getColor(datas)
      // this._colors = d3.schemeSet3
    } else {
      // 如果不开启渐变，那就一条数据对应一个颜色
      // this._colors = d3.schemeSet3
      this._colors = this.getColor(datas)

      datas.forEach((d, i) => (d.color = this._colors[i]))
    }

    // 存入索引
    datas.forEach((d, i) => (d.index = i))

    this._data.datas = this.computeCirclesPosition(datas)
    return this
  }

  //   drawFallback() {
  //     this.root.style('opacity', 0.5)
  //     this.data(renjuData.education.data)
  //     this.draw({})
  //   }

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

    this._g = this.root.append('g').attr('transform', `translate(0, ${this.mainHeight / 2})`)

    this._defs = this.root.append('defs')

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
   * 在计算好可变（data）和不可变（draw）后可以利用计算的结果来绘制和更新图表了
   * @return {object} 图表实例
   */
  update() {
    // const enableGradient = this.config('enableGradient')
    const enableGradient = true

    const circleOpacity = this.config('circleOpacity')

    const labelSize = this.fontSize(this.config('labelSize'))

    const labelColor = this.config('labelColor')

    const labelAngle = this.config('labelAngle')

    const labelOffsetY = this.config('labelOffsetY')

    const valueSize = this.fontSize(this.config('valueSize'))

    const valueColor = this.config('valueColor')

    const valueType = this.config('valueType')

    const valueOffsetY = this.config('valueOffsetY')

    const lineColor = this.config('lineColor')

    const lineOpacity = this.config('lineOpacity')

    const gradientIdPrefix = this._gradientIdPrefix

    // 数值展示为百分比/数值本身
    const useValuePercent = valueType === STATIC.VALUE_TYPE[0].key
    // 标签文本的y位置
    const labelY = this.mainHeight / 2 - labelOffsetY
    // 值文本的y位置
    const valueY = -this.mainHeight / 2 - valueOffsetY
    // 上辅助线上顶点y位置
    const lineUpY = -this.mainHeight / 2 + 10
    // 下辅助线下顶点y位置
    const lineDownY = this.mainHeight / 2 - 10
    // 旋转时影响文本对齐
    const labelTextAnchor = !labelAngle ? 'middle' : labelAngle > 0 ? 'start' : 'end'
    // 旋转时要有一定的位移
    const labelDx = 0

    if (enableGradient) {
      this.drawGradients()
    }

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    // 绘制更新
    this.renjuChart = this._g
      // 分组
      .update('g', {
        data: this._data.datas,
        dataKey: (d) => d.label,
        enter: {
          attr: {
            'text-anchor': 'middle',
          },
        },
        all: {
          attr: {
            transform: (d) => `translate(${d.x}, 0)`,
          },
        },
      })
      // 圆
      .update('circle.wave-renju-circle', {
        data: (d) => [d],
        enter: {
          attr: {
            r: 0,
            'fill-opacity': circleOpacity,
          },
        },
        attr: {
          fill: (d) => (!enableGradient ? d.color : `url(#${gradientIdPrefix}-${d.index})`),
        },
        transitionAll: {
          attr: {
            r: (d) => d.r,
          },
        },
        on: {
          click: (d) => {
            const tooltipData = {
              list: [{key: d.label, value: d.value}],
              ...this.tooltipPosition,
            }
            this.event.fire('circleClick', {data: tooltipData, e: d3.event})
          },
        },
      })
      // 上辅助线
      .upper()
      .update('line.wave-renju-line.up-line', {
        data: (d) => [d],
        enter: {
          attr: {
            y1: lineUpY,
            // 'y2': lineUpY,
            stroke: lineColor,
            'stroke-opacity': lineOpacity,
          },
        },
        // transition对svg的attr属性不起作用，或者说这类属性不能用style设置
        all: {
          attr: {
            y2: (d) => -d.r,
          },
        },
      })
      // 下辅助线
      .upper()
      .update('line.wave-renju-line.down-line', {
        data: (d) => [d],
        enter: {
          attr: {
            y1: lineDownY,
            // 'y2': lineDownY,
            stroke: lineColor,
            'stroke-opacity': lineOpacity,
          },
        },
        all: {
          attr: {
            y2: (d) => d.r,
          },
        },
      })

    if (!this._isWarn) {
      // 标签
      this.renjuChart
        .upper()
        .update('text.wave-renju-label', {
          data: (d) => [d],
          enter: {
            attr: {
              'font-size': labelSize,
              fill: labelColor,
              // 需要先translate改变标签的坐标系，否则旋转相对的是外层的坐标系，不能用y/dy
              transform: `translate(${labelDx}, ${labelY - this.getTextHeight(labelSize)}) rotate(${labelAngle})`,
              'dominant-baseline': labelAngle > 70 ? 'middle' : 'text-before-edge',
              'text-anchor': labelTextAnchor,
            },
          },
          text: (d) => d.label,
        })
        // 值
        .upper()
        .update('text.wave-renju-value', {
          data: (d) => [d],
          enter: {
            attr: {
              'font-size': valueSize,
              fill: valueColor,
              y: valueY + this.getTextHeight(valueSize),
            },
          },
          text: (d) => (useValuePercent ? `${d.percent}%` : this.formatNumber(d.value)),
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
    // 动画开关控制
    const enableEnterAnimation = true
    // 动画时间
    const enterAnimationDuration = 2000
    // 轮播动画
    const enableLoopAnimation = false
    // 轮播动画
    const loopAnimationDuration = 2000
    // 轮播延时
    const loopAnimationDelay = 2000
    if (enableLoopAnimation) {
      this.rippleAnimation = new RippleAnimation(
        {
          targets: this._g.selectAll('.wave-renju-circle'),
          delay: loopAnimationDelay,
          duration: loopAnimationDuration,
          loop: true,
        },
        this
      )
    }

    if (enableEnterAnimation) {
      // 开启动画
      this._g.selectAll('circle.wave-renju-circle').setAnimation({
        attr: {
          r: (d) => d.r,
        },
        duration: enterAnimationDuration,
        onEnd: () => {
          // 动画结束后更改图表状态为就绪
          this.ready()
          enableLoopAnimation && this.rippleAnimation.play()
        },
      })
    } else {
      // 关闭动画
      // .....
      // 更改图表状态为就绪
      this.ready()
      enableLoopAnimation && this.rippleAnimation.play()
    }

    return this
  }

  /**
   * @description 计算点的半径与x位置，返回修改后的数组
   * @param {*} datas 数据数组
   * @returns
   */
  computeCirclesPosition(datas) {
    const scaleX = d3.scalePoint().domain(d3.range(datas.length)).range([0, this.mainWidth]).padding(0.7)

    // 半径规则：如果有设置，取设置的值；如果没有，默认为圆心间距的0.7；允许重叠
    const maxRadius = this.config('circleMaxRadius') || Math.min(scaleX.step() * 0.7, this.mainHeight / 2)

    // 用开方比例尺，用圆的面积而不是半径来作为对比
    const scaleR = d3.scaleSqrt().domain([0, this._maxValue]).range([0, maxRadius])

    datas.forEach((d, i) => {
      d.r = scaleR(d.value)
      d.x = scaleX(i)
    })

    return datas
  }

  /**
   * @description 绘制渐变元素
   */
  drawGradients() {
    // 注意：渐变时，colors长度比数据长度多1
    const colors = this._colors
    const prefix = this._gradientIdPrefix

    this._defs
      .update('linearGradient', {
        data: d3.range(colors.length - 1),
        attr: {
          id: (d) => `${prefix}-${d}`,
          x1: '0%',
          x2: '100%',
        },
      })
      .update('stop', {
        data: (d) => [colors[d], colors[d + 1]],
        attr: {
          'stop-color': (d) => d,
          offset: (d, i) => (i === 0 ? '0%' : '100%'),
        },
      })
  }
}

Renju.version = '__VERSION__'
