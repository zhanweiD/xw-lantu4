import * as d3 from 'd3'
import Base from '../base'
import {dataUtil} from '../util'
import {RippleAnimation} from '../base/animation'

const {createUuid, drawTitle, drawUnit, getTextWidth, getTextHeight} = Base

export const STATIC = {
  LAYOUT_TYPE: [
    {
      key: 'VERTICAL',
      value: '垂直',
    },
    {
      key: 'HORIZONTAL',
      value: '水平',
    },
  ],
}

const defaultOption = {
  layoutType: STATIC.LAYOUT_TYPE[0].key,
  circleOpacity: 1,
  circleMaxRadius: null,
  labelSize: 12,
  labelColor: 'rgba(255, 255, 255, 0.65)',
  valueVisible: true,
  valueSize: 12,
  valueColor: 'rgba(255, 255, 255, 0.65)',
  labelKey: 'label',
  valueKey: 'value',
  contrastKey: 'contrast',
  _type: 'canLayout',
}

/**
 * 注意：这个图垂直和水平布局差异极大，改动代码时要考虑要改的内容是否会受布局方式影响
 */

export default class Hourglass extends Base {
  static key = 'hourglass'

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    this.root.attr('class', 'wave-hourglass')

    this._id = createUuid()

    // 圆心半径
    this._centerRadius = 3
    // 圆心颜色
    this._centerColor = '#fff'
    // 圆与圆之间的最小间距（当两个圆都是最大半径时）相对最大圆半径的比例
    this._gapRatio = 2 / 3
    // 值文本与圆之间的间距
    this._valueGap = 4
    this.getTextHeight = getTextHeight
    this.formatNumber = this.numberFormat
    this.drawTitle = drawTitle
    this.drawUnit = drawUnit
    this.getTextWidth = getTextWidth
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
    // 此处做一个兼容，后续干掉前一种数据结构
    let highLowKeyList = ['value', 'compare']
    let legendsName = []
    if (Object.prototype.toString.call(source) === '[object Object]') {
      highLowKeyList = [source.valueKey.tag, source.compareKey.tag]
      legendsName = [source.valueKey.name, source.compareKey.name]
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
    source = dataUtil.transform([this.config('labelKey')], [highLowKeyList], source)

    // 最大值
    const maxValues = dataUtil.maxValue(source, source.maxValue)
    this._maxValue = maxValues[source.unit[0]]

    // 提取需要的数据和格式
    const data = dataUtil.classify(source, true)[0].labels.map((d) => d.data[0])

    this._datas = data.map((d, i) => ({
      index: i,
      label: d.dimensions[0],
      values: d.values.slice(0, 2),
      // origin: [d],
    }))

    // 只需要两个颜色
    this._colors = this.getColor(data)
    // this._colors = d3.schemeSet3.slice(0, 2)

    // 图例数据
    this._legends = source.valueDescription.map((vd, i) => ({
      label: this.dataRule === 'new' ? legendsName[i] : vd,
      color: this._colors[i],
    }))

    !this._isWarn && this.drawLegends({legends: this._legends})

    // 去掉标签文本后的高度，计算和布局时要依赖这个
    this._hourglassHeight = this.mainHeight // - this.getTextHeight(this.font(this.config('labelSize'))) + 10

    // 需要先判断布局模式，这会影响到computeScales()计算
    this._isHorizontal = this.config('layoutType') === STATIC.LAYOUT_TYPE[1].key

    // 计算scaleX和scaleR
    this.computeScales()

    return this
  }

  drawWarnChart() {
    this._g = this.root
      .append('g')
      .attr('transform', `translate(0, ${this._hourglassHeight / 2})`)
      .attr('text-anchor', 'middle')

    this._defs = this.root.append('defs')
    this.drawGradient()
    const circleOpacity = this.config('circleOpacity')

    const isHorizontal = this._isHorizontal
    const scaleR = this._scaleR
    const bandwidth = this._scaleX.bandwidth()
    // const centerDistance = this._centerDistance

    const halfCenterDistance = this._centerDistance / 2

    const getGroupTransform = (d, i) => {
      const x = this._scaleX(i) + bandwidth / 2
      const y = 0
      return `translate(${x}px, ${y}px)`
    }
    const getCy = (d, i) => {
      if (isHorizontal) {
        return 0
      }
      return [-halfCenterDistance, halfCenterDistance][i]
    }
    const getCx = (d, i) => {
      if (isHorizontal) {
        return [-halfCenterDistance, halfCenterDistance][i]
      }
      return 0
    }
    // 标签的y位置：水平时要稍微往下移，垂直时，不需要

    this._g
      // 分组
      .update('g.wave-hourglass-group', {
        data: this._datas,
        dataKey: (d) => d.label,
        enter: {
          style: {
            transform: getGroupTransform,
          },
        },
        transitionUpdate: {
          style: {
            transform: getGroupTransform,
          },
        },
      })
      // 连接曲线
      .update('path.wave-hourglass-link', {
        data: (d) => [d],
        dataKey: (d) => d.label,
        enter: {
          attr: {
            d: (d) => this.getLinkPath(d),
            fill: `url(#wave-hourglass-gradient-${this._id})`,
            opacity: 0.6,
          },
        },
        transitionEnter: {
          style: {
            transform: 'translate(0, 0) scale3d(1, 1, 1)',
          },
        },
        transitionUpdate: {
          attr: {
            d: (d) => this.getLinkPath(d),
          },
        },
      })
      // 节点圆
      .upper()
      .update('circle.wave-hourglass-circle', {
        data: (d) => d.values,
        dataKey: (d, i) => i,
        enter: {
          attr: {
            r: 0,
            cy: getCy,
            cx: getCx,
            fill: (d, i) => this._colors[i],
            opacity: circleOpacity,
          },
        },
        transitionAll: {
          attr: {
            r: scaleR,
          },
        },
      })
      // 圆心
      .upper()
      .update('circle.wave-hourglass-center-circle', {
        data: (d) => d.values,
        dataKey: (d, i) => i,
        attr: {
          r: this._centerRadius,
          cy: getCy,
          cx: getCx,
          fill: this._centerColor,
          opacity: circleOpacity,
        },
      })
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

    this._g = this.root
      .append('g')
      .attr('transform', `translate(0, ${this._hourglassHeight / 2})`)
      .attr('text-anchor', 'middle')

    this._defs = this.root.append('defs')

    this.drawGradient()

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
    const circleOpacity = this.config('circleOpacity')
    const valueVisible = this.config('valueVisible')
    const valueSize = this.fontSize(this.config('valueSize'))
    const valueColor = this.config('valueColor')
    const labelSize = this.fontSize(this.config('labelSize'))
    const labelColor = this.config('labelColor')
    const labelAngle = this.config('labelAngle')
    const labelOffsetY = this.config('labelOffsetY')

    const isHorizontal = this._isHorizontal
    const valueGap = this._valueGap
    const scaleR = this._scaleR
    const bandwidth = this._scaleX.bandwidth()
    // const centerDistance = this._centerDistance

    const halfCenterDistance = this._centerDistance / 2

    const getGroupTransform = (d, i) => {
      const x = this._scaleX(i) + bandwidth / 2
      const y = 0
      return `translate(${x}px, ${y}px)`
    }
    const getCy = (d, i) => {
      if (isHorizontal) {
        return 0
      }
      return [-halfCenterDistance, halfCenterDistance][i]
    }
    const getCx = (d, i) => {
      if (isHorizontal) {
        return [-halfCenterDistance, halfCenterDistance][i]
      }
      return 0
    }
    // 标签的y位置：水平时要稍微往下移，垂直时，不需要
    // const labelY = isHorizontal ? this._maxRadius + 10 : this._hourglassHeight / 2
    const labelY = this._hourglassHeight / 2 + labelOffsetY

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    const hourglassChart = this._g
      // 分组
      .update('g.wave-hourglass-group', {
        data: this._datas,
        dataKey: (d) => d.label,
        enter: {
          style: {
            transform: getGroupTransform,
          },
        },
        transitionUpdate: {
          style: {
            transform: getGroupTransform,
          },
        },
      })
      // 连接曲线
      .update('path.wave-hourglass-link', {
        data: (d) => [d],
        dataKey: (d) => d.label,
        enter: {
          attr: {
            d: (d) => this.getLinkPath(d),
            fill: `url(#wave-hourglass-gradient-${this._id})`,
            opacity: 0.6,
          },
        },
        transitionEnter: {
          style: {
            transform: 'translate(0, 0) scale3d(1, 1, 1)',
          },
        },
        transitionUpdate: {
          attr: {
            d: (d) => this.getLinkPath(d),
          },
        },
      })
      // 节点圆
      .upper()
      .update('circle.wave-hourglass-circle', {
        data: (d) => d.values,
        dataKey: (d, i) => i,
        enter: {
          attr: {
            r: 0,
            cy: getCy,
            cx: getCx,
            fill: (d, i) => this._colors[i],
            opacity: circleOpacity,
          },
          // on: {
          //   click: (d, i, elm) => {
          //     console.log({value: d, label: elm[i].parentNode.__data__.label, index: elm[i].parentNode.__data__.index})
          //   },
          // },
        },
        transitionAll: {
          attr: {
            r: scaleR,
          },
        },
      })
      // 圆心
      .upper()
      .update('circle.wave-hourglass-center-circle', {
        data: (d) => d.values,
        dataKey: (d, i) => i,
        attr: {
          r: this._centerRadius,
          cy: getCy,
          cx: getCx,
          fill: this._centerColor,
          opacity: circleOpacity,
        },
        // on: {
        //   click: (d, i, elm) => {
        //     console.log({value: d, label: elm[i].parentNode.__data__.label, index: elm[i].parentNode.__data__.index})
        //   },
        // },
      })

    if (!this._isWarn) {
      hourglassChart // 值文本
        .upper()
        .update('text.wave-hourglass-value', {
          data: valueVisible ? (d) => d.values : null,
          dataKey: (d, i) => i,
          attr: {
            fill: valueColor,
            'font-size': valueSize,
            x: getCx,
            y: (d, i) => {
              if (isHorizontal) {
                return -this._centerRadius - valueGap
              }

              if (i === 0) {
                return getCy(d, 0) - scaleR(d) - valueGap
              }
              return getCy(d, 1) + scaleR(d) + valueGap
            },
            'dominant-baseline': (d, i) => (!isHorizontal && i === 1 ? 'text-before-edge' : 'text-after-edge'),
          },
          text: (d) => this.formatNumber(d),
        })
        // 标签文本
        .upper()
        .update('text.wave-hourglass-label', {
          data: (d) => [d],
          dataKey: (d) => d.label,
          attr: {
            'font-size': labelSize,
            fill: labelColor,
            y: labelY,
            'dominant-baseline': 'text-before-edge',
            transform: `rotate(${labelAngle})`,
            'transform-origin': (d, i) => {
              const x = this._scaleX(i)
              return `${x} ${labelY}`
            },
          },
          text: (d) => d.label,
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
    // const enableEnterAnimation = this.config('enableEnterAnimation')
    const enableEnterAnimation = true
    // 动画时间
    // const enterAnimationDuration = this.config('enterAnimationDuration')
    const enterAnimationDuration = 2000

    // 轮播动画
    // const enableLoopAnimation = this.config('enableLoopAnimation')
    const enableLoopAnimation = false

    // 轮播动画
    // const loopAnimationDuration = this.config('loopAnimationDuration')
    const loopAnimationDuration = 2000

    // 轮播延时
    // const loopAnimationDelay = this.config('loopAnimationDelay')
    const loopAnimationDelay = 2000

    if (enableLoopAnimation) {
      this.rippleAnimation = new RippleAnimation(
        {
          targets: this._g.selectAll('.wave-hourglass-circle'),
          delay: loopAnimationDelay,
          duration: loopAnimationDuration,
          loop: true,
        },
        this
      )
    }

    if (enableEnterAnimation) {
      // 开启动画

      const startLinkTransform = this._startLinkTransform
      // 圆动画
      this._g.selectAll('circle.wave-hourglass-circle').setAnimation({
        attr: {
          r: (d) => this._scaleR(d),
        },
        duration: enterAnimationDuration / 2,
      })

      // link动画
      this._g.selectAll('path.wave-hourglass-link').setAnimation({
        style: {
          transform: {
            from: startLinkTransform,
            to: 'translate(0, 0) scale3d(1, 1, 1)',
          },
        },
        delay: enterAnimationDuration / 2,
        duration: enterAnimationDuration / 2,
        onEnd: () => {
          // 动画结束后更改图表状态为就绪
          this.ready()
          enableLoopAnimation && this.rippleAnimation.play()
        },
      })
    } else {
      // 关闭动画
      this._g.selectAll('path.wave-hourglass-link').style('transform', 'translate(0, 0) scale3d(1, 1, 1)')
      // 更改图表状态为就绪
      this.ready()
      enableLoopAnimation && this.rippleAnimation.play()
    }

    return this
  }

  // 计算scaleX和scaleR、上下圆心y坐标
  computeScales() {
    const datas = this._datas
    const width = this.mainWidth
    const valueHeight = this.getTextHeight(this.fontSize(this.config('valueSize')))
    let maxRadius = this.config('circleMaxRadius')

    const height = this._hourglassHeight // 漏斗图形的可用高度
    const gapRatio = this._gapRatio
    const valueGap = this._valueGap // 值与圆之间建的大概间距
    let scalePaddingInner = 0.2 // 每个分组之间间距占分组宽的比例

    if (this._isHorizontal) {
      scalePaddingInner = 0.1
    }

    const maxValue = this._maxValue // d3.max(datas, (d: any) => Math.max(...d.values))

    const scaleX = d3.scaleBand().domain(d3.range(datas.length)).range([0, width]).paddingInner(scalePaddingInner)

    if (!maxRadius) {
      // 如果没有设置最大半径，那么需要进行计算，要考虑文字、高度、间距等
      if (this._isHorizontal) {
        // 垂直方向：两个圆4份半径
        const maxRadiusByHeight = height / 2

        // 水平方向
        const maxRadiusByWidth = scaleX.bandwidth() / (4 + gapRatio)

        maxRadius = Math.min(maxRadiusByWidth, maxRadiusByHeight)
      } else {
        const availableHeight = height - (valueHeight + valueGap) * 2

        // 垂直方向：4指两个圆4份半径，加上最小间距的占比gapRatio
        const maxRadiusByHeight = availableHeight / (4 + gapRatio)

        // 水平方向
        const maxRadiusByWidth = scaleX.bandwidth() / 2

        maxRadius = Math.min(maxRadiusByWidth, maxRadiusByHeight)
      }
    }

    // 使用开方比例尺，使得圆与圆之间基于面积而不是半径作为对比
    this._scaleR = d3.scaleSqrt().domain([0, maxValue]).range([0, maxRadius])

    this._scaleX = scaleX

    this._maxRadius = maxRadius

    // 圆心间距
    this._centerDistance = maxRadius * (2 + gapRatio)
  }

  // 计算圆与圆之间的连接管道的Path路径
  getLinkPath(d) {
    // 取两圆圆心连线的中点作为控制点
    const x = 0
    const y = 0

    const r1 = this._scaleR(d.values[0] || 0)
    const r2 = this._scaleR(d.values[1] || 0)

    const ctrlPoint = [x, y]
    let p1
    let p2
    let p3
    let p4

    // 曲线由4个点决定，找出这4个点就行
    if (this._isHorizontal) {
      const x1 = -this._centerDistance / 2
      const x2 = this._centerDistance / 2
      p1 = [x1, y - r1]
      p2 = [x2, y - r2]
      p3 = [x2, y + r2]
      p4 = [x1, y + r1]
    } else {
      const y1 = -this._centerDistance / 2
      const y2 = this._centerDistance / 2
      p1 = [x + r1, y1]
      p2 = [x + r2, y2]
      p3 = [x - r2, y2]
      p4 = [x - r1, y1]
    }

    // return `M${x + r1},${y1}`
    //   + `Q${x},${y},${x + r2},${y2}`
    //   + `L${x - r2},${y2}`
    //   + `Q${x},${y},${x - r1},${y1}`
    //   + 'Z'

    return `M${p1}Q${ctrlPoint},${p2}L${p3}Q${ctrlPoint},${p4}Z`
  }

  // 绘制渐变元素，因为都是同样颜色，所以只绘制一个就够了
  drawGradient() {
    let loc
    if (this._isHorizontal) {
      loc = {
        x1: '0',
        y1: '0%',
        x2: '100%',
        y2: '0%',
      }
    } else {
      loc = {
        y1: '0%',
        y2: '100%',
        x1: '0',
        x2: '0',
      }
    }

    this._defs
      .update('linearGradient', {
        data: [1],
        dataKey: (d) => d,
        attr: {
          id: `wave-hourglass-gradient-${this._id}`,
          ...loc,
        },
      })
      .update('stop', {
        data: [0, 1],
        dataKey: (d) => d,
        attr: {
          'stop-color': (d) => this._colors[d],
          offset: (d) => `${d * 100}%`,
        },
      })
  }

  get _startLinkTransform() {
    return this._isHorizontal
      ? `translate(${-this._centerDistance / 2}px, 0) scale3d(0, 0, 1)`
      : `translate(0, ${-this._centerDistance / 2}px) scale3d(0, 0, 1)`
  }
}

Hourglass.version = '__VERSION__'
