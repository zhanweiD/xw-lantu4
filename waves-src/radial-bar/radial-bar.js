import * as d3 from 'd3'
import Base from '../base'
import {dataUtil, parentData} from '../util'

const {drawTitle, drawUnit} = Base

const STATIC = {
  ORDER: [
    {
      key: 'POSITIVE',
      value: '正序',
    },
    {
      key: 'REVERSE',
      value: '倒序',
    },
    {
      key: 'DEFAULT',
      value: '默认',
    },
  ],
}

const defaultOption = {
  order: STATIC.ORDER[0].key,
  labelSize: 12,
  labelColor: 'rgba(255, 255, 255, 0.65)',
  valueVisible: false,
  labelOffset: 10,
  arcBackgroundColor: 'rgba(255,255,255,0.15)',
  arcWidth: null,
  arcBackgroundWidth: null,
  arcGap: 20,
  minRadius: 50,
  labelKey: 'label',
  valueKey: 'value',
  _type: 'canLayout',
}

export default class RadialBar extends Base {
  static key = 'radialBar'

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    this.root.attr('class', 'wave-radial-bar')

    this.drawTitle = drawTitle
    this.drawUnit = drawUnit
    this.formatNumber = this.numberFormat
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(source) {
    try {
      const version = this.cartesianCoordinateJudgingVersion(source)
      if (!version) {
        console.error('数据结构错误')
        this.warn({text: '数据结构错误', onTextClick: () => console.log('数据结构错误，未匹配到符合的数据版本')})
        throw new Error('数据结构错误')
      }
      if (source.length > 0) {
        this._data.source = source
      } else {
        throw new Error('')
      }
    } catch (err) {
      console.error('Data format error')
      this.warn({text: '数据结构错误', onTextClick: () => console.log('数据处理时出错')})
      throw new Error('数据结构错误')
    }

    // 转换数据为老的格式（未来有时间要干掉优化）
    source = dataUtil.transform([this.config('labelKey')], [[this.config('valueKey')]], source)
    const arcGap = this.config('arcGap')
    const order = this.config('order')
    const datas = dataUtil.classify(source)
    const data = datas[0].labels

    // 图表的大小
    // 应该是宽高最小值
    this._size = Math.min(this.mainWidth, this.mainHeight)
    console.log(this.config('labelKey'), this.config('valueKey'), this._size)

    // 弧的宽度？
    // 默认图表大小 / 30
    this._data.arcWidth = this.config('arcWidth') || this._size / 30
    // 内圈最小半径
    // 应该是图表大小 - 弧宽度总和 - 弧间距总和
    const _minRadius = this._size / 2 - (data.length - 1) * arcGap - data.length * this._data.arcWidth

    // 最大值
    const maxValue = dataUtil.assembleValueRange(datas, source)

    // 颜色
    // const color = d3.schemeSet3
    const color = this.getColor(data.length)
    this._data._minRadius = _minRadius > this.config('minRadius') ? _minRadius : this.config('minRadius')
    this._data.data =
      order === STATIC.ORDER[0].key
        ? data.sort((a, b) => a.total[0] - b.total[0])
        : order === STATIC.ORDER[1].key
        ? data.sort((a, b) => b.total[0] - a.total[0])
        : data

    this._data.maxValue = maxValue[source.unit[0]][1]
    this._data.color = color
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

    // 容器默认居中
    this._content = this.root.append('g').attr('transform', `translate(${this.mainWidth / 2}, ${this.mainHeight / 2})`)

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
    const arcGap = this.config('arcGap')
    const labelSize = this.fontSize(this.config('labelSize'))
    const labelColor = this.config('labelColor')
    const valueVisible = this.config('valueVisible')
    console.log(valueVisible)
    const labelOffset = this.config('labelOffsetY')
    const arcBackgroundColor = this.config('arcBackgroundColor')
    const {_minRadius, maxValue, data, color, arcWidth} = this._data
    const arcBackgroundWidth = Math.min(this.config('arcBackgroundWidth') || arcWidth, arcWidth)

    const arcCenter = (arcWidth - arcBackgroundWidth) / 2

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    // 起始角度
    const startAngle = Math.PI
    const endAngle = Math.PI * 2.5

    // 弧瓣生成器
    this._arcGenerator = d3.arc()

    // 角度比例尺
    this._scale = d3.scaleLinear().range([startAngle, endAngle]).domain([0, maxValue])

    // 获取角度信息
    data.forEach((d, i) => {
      d.path = {
        startAngle,
        endAngle: this._scale(d.total[0]),
        innerRadius: _minRadius + i * arcWidth + i * arcGap,
        outerRadius: _minRadius + (i * arcWidth + arcWidth) + i * arcGap,
      }
    })

    /* 更新 */
    const setArcBackAttr = {
      fill: arcBackgroundColor,
      d: (d) => {
        const pathData = {
          startAngle,
          endAngle,
          innerRadius: d.innerRadius + arcCenter,
          outerRadius: d.innerRadius + arcCenter + arcBackgroundWidth,
        }
        return this._arcGenerator(pathData)
      },
    }

    const radialBarChart = this._content
      .update('g.wave-radial-bar-item', {
        data,
        dataKey: (d) => d.label,
      })

      // 弧背景
      .update('path.wave-radial-bar-arc-back', {
        data: (d) => [d.path],

        enter: {
          attr: setArcBackAttr,
        },
        update: {
          attr: setArcBackAttr,
        },
      })

      // 弧
      .upper()
      .update('path.wave-radial-bar-arc', {
        data: (d) => [d.path],

        all: {
          attr: {
            fill: (d, i, elms) => {
              const pd = parentData(elms[i])
              return color[pd.index]
            },
          },
        },
        transitionAll: {
          d3tween: {
            // 这个回调即时d3 tween方法的回调参数，不同的是添加了formerData参数，它代表上一份旧数据
            d: (d, i, elms, formerData) => {
              let s = null
              // 看看有上一份数据没
              if (formerData) {
                s = formerData
              } else {
                s = {...d}
                s.endAngle = s.startAngle
              }
              const interpolate = d3.interpolate(s, d)
              return (t) => {
                // 这里为什么要每次插值都储存？为了能在动画还没结束时数据更新了然后能够在当前状态无缝连接并过渡到新的状态
                const pathData = interpolate(t)
                d3.select(elms[i]).property('formerData', pathData).attr('d', this._arcGenerator(pathData))
              }
            },

            // 这个属性的意思是 在图表就绪之前:
            // 如果图表显示了入场动画 并且firstInvalid = true 那么图表加载的第一次将不会执行该transitionAll.d3tween 仅在数据更新时执行
            // 如果图表没有显示入场动画 那么firstInvalid无效 始终会执行该 transitionAll.d3tween
            // 如果图表已经就绪 那么它将毫无用处
            firstInvalid: true,
          },
        },
      })

    if (!this._isWarn) {
      radialBarChart.upper().update('text.wave-radial-bar-label', {
        data: (d) => [d],

        enter: {
          attr: {
            fill: labelColor,
            'font-size': labelSize,
            'dominant-baseline': 'middle',
            dx: labelOffset,
          },
        },
        attr: {
          dy: (d, i, elms) => {
            const pd = parentData(elms[i])
            return _minRadius + pd.index * arcWidth + pd.index * arcGap + arcWidth / 2
          },
        },
        text: (d) => (valueVisible ? `${d.label} ${this.formatNumber(d.total[0])}` : d.label),
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
    // const enableEnterAnimation = this.config('enableEnterAnimation')

    // 动画时间
    const enterAnimationDuration = 2000
    // const enterAnimationDuration = this.config('enterAnimationDuration')

    if (enableEnterAnimation) {
      this._content.selectAll('.wave-radial-bar-arc').setAnimation({
        // 添加一个type告诉方法使用d3的tween方式执行动画
        type: 'd3tween',
        attr: {
          d: {
            from: 'M0 0',
            to: (d, index, elms) => {
              const obj = {...d}
              obj.endAngle = d.startAngle
              const i = d3.interpolate(obj, d)
              return (t) => {
                elms[index].setAttribute('d', this._arcGenerator(i(t)))
              }
            },
          },
        },
        duration: enterAnimationDuration,
        onEnd: () => {
          this.ready()
        },
      })
    } else {
      // 关闭动画
      // .....

      // 更改图表状态为就绪
      this.ready()
    }

    return this
  }
}

RadialBar.version = '__VERSION__'
