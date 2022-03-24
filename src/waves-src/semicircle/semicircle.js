import * as d3 from 'd3'
import Base from '../base'
import {dataUtil} from '../util'

// 此图建议重构，存在较大bug
// 此图下标签建议自己实现
const {drawAxisX, getTextWidth, getTextHeight} = Base

const STATIC = {
  ORDER_TYPE: [
    {
      key: 'MIN_MAX',
      value: '升序',
    },
    {
      key: 'MAX_MIN',
      value: '降序',
    },
    {
      key: 'DEFAULT',
      value: '默认',
    },
  ],
}

const defaultOption = {
  orderType: STATIC.ORDER_TYPE[0].key,
  valueVisible: true,
  valueFontSize: 12,
  valueColor: 'rgba(255,255,255,0.65)',
  arcLineColor: 'rgba(255,255,255,0.2)',

  // 数据配置 > 标签
  labelKey: 'label',
  // 数据配置 > 目标值
  valueKey: 'value',
  // 数据配置 > 比较值
  compareKey: 'compare',
  _type: 'canLayout',
}

export default class Semicircle extends Base {
  static key = 'semicircle'

  constructor(option) {
    super(option, defaultOption)
    this._data = {}
    this.root.attr('class', 'wave-semicircle')

    this.drawAxisX = drawAxisX
    this.getTextHeight = getTextHeight
    this.getTextWidth = getTextWidth
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
      if (_data.data.length > 0) {
        this._data.source = _data.data
      } else {
        throw new Error('')
      }
    } catch (err) {
      console.error('Data format error')
      throw new Error('数据结构错误')
    }

    // 转换数据为老的格式（未来有时间要干掉优化）
    const source = dataUtil.transform([_data.labelKey.tag], [[_data.valueKey.tag, _data.compareKey.tag]], _data.data)

    const orderType = this.config('orderType')
    const {ORDER_TYPE} = STATIC

    // 分类
    let data = dataUtil.classify(source, true)[0].labels

    // 排序
    data =
      orderType === ORDER_TYPE[0].key
        ? data.sort((a, b) => d3.sum(a.data[0].values) - d3.sum(b.data[0].values))
        : orderType === ORDER_TYPE[1].key
        ? data.sort((a, b) => d3.sum(b.data[0].values) - d3.sum(a.data[0].values))
        : data

    // 获取最大值
    const maxValue = dataUtil.maxValue(source)[source.unit[0]]

    // 颜色
    // 固定两个颜色
    const colors = this.getColor([1, 2])
    this._colors = colors

    // 图例 - 图例按照值的描述个数表示
    const legendsLable = [_data.valueKey.name, _data.compareKey.name]
    this._data.legends = source.valueDescription.map((v, i) => ({label: legendsLable[i], color: this._colors[i]}))
    // x轴标签
    this._data.labels = data.map((d) => d.label)

    this._data.data = data
    this._data.maxValue = maxValue
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

    // 图例
    !this._isWarn && this.drawLegends({legends: this._data.legends})

    // 弧容器
    // 垂直居中
    this._arcContainer = this.root
      .append('g')
      .attr('class', 'wave-semicircle-arcs')
      .attr('transform', `translate(0, ${this.mainHeight / 2})`)

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
    const valueVisible = this.config('valueVisible')
    const valueFontSize = this.fontSize(this.config('valueSize'))
    const valueColor = this.config('valueColor')
    // const time = this.config('updateDuration')
    const lineColor = this.config('arcLineColor')
    // const valueVisible = true
    // const valueFontSize = 12
    // const valueColor = 'red'
    const time = 1000
    // const lineColor = 'pink'
    const {data, labels, maxValue} = this._data

    const circumference = Math.PI * 2
    const mainHeight = this.mainHeight / 2

    // 是否显示更新动画
    const animation = lineColor ? `transform ${time / 1000}s` : 'none'

    // 弧生成器
    const arcGenerator = d3.arc()

    // X轴
    this._scaleX = this.baseDrawAxisX({
      rangeValue: this.mainWidth,
      domain: labels,
      barWidth: labels.length === 1 ? 0 : this.mainWidth / labels.length / 2,
    }).scale

    // 弧比例尺
    // 半径最大不能超过X轴的两个label之间的间距 / 2
    this._scaleR = d3
      .scaleLinear()
      .range([0, labels.length === 1 ? this.mainWidth / 2 : (this._scaleX(labels[1]) - this._scaleX(labels[0])) / 2])
      .domain([0, maxValue])

    // 生成上部分弧度
    const top = (v) => {
      return {
        startAngle: 0 - circumference / 4,
        endAngle: circumference / 4,
        innerRadius: 0,
        outerRadius: this._scaleR(v),
      }
    }

    // 生成下部分弧度
    const bottom = (v) => {
      return {
        startAngle: circumference - circumference / 4,
        endAngle: circumference / 4,
        innerRadius: 0,
        outerRadius: this._scaleR(v),
      }
    }

    // 标签连线
    // 只有标签和圆的间距够大才会绘制连线
    const y1 = this._scaleR(maxValue) + 53
    const y2 = mainHeight - 50

    /* 更新 */

    // 每一列的容器
    const arcContainer = this._arcContainer
      .update('g.wave-semicircle-item', {
        data,
        dataKey: (d) => d.label,
        style: {
          transform: (d) => `translate(${this._scaleX(d.label)}px, 0)`,
          transition: animation,
        },
      })

      // 弧
      .update('path.wave-semicircle-arc', {
        data: (d) => d.data[0].values,

        enter: {
          attr: {
            fill: (d, i) => this._colors[i],
          },
        },
        transitionAll: {
          d3tween: {
            d: (v, i, elms, formerData) => {
              const d = i === 0 ? top(v || 0) : bottom(v || 0)
              let s = null
              // 看看有上一份数据没
              if (formerData) {
                s = formerData
              } else {
                s = i === 0 ? top(0) : bottom(0)
              }
              const interpolate = d3.interpolate(s, d)
              return (t) => {
                // 这里为什么要每次插值都储存？为了能在动画还没结束时数据更新了然后能够在当前状态无缝连接并过渡到新的状态
                const res = interpolate(t)

                // 上部分还是下部分
                d3.select(elms[i]).property('formerData', res).attr('d', arcGenerator(res))
              }
            },
          },
        },
      })

      // 更新虚线
      .upper()
      .update('line.wave-semicircle-line', {
        data: y2 - y1 > 50 ? (d) => [d] : null,
        enter: {
          attr: {
            'stroke-dasharray': '6 6',
            stroke: lineColor,
            'stroke-width': 2,
          },
        },
        all: {
          attr: {
            y1,
            y2,
          },
        },
      })

    if (!this._isWarn) {
      // 更新值
      arcContainer.upper().update('text.wave-semicircle-value', {
        data: valueVisible ? (d) => d.data[0].values : null,
        enter: {
          attr: {
            fill: valueColor,
            'font-size': valueFontSize,
            'text-anchor': 'middle',
            dy: (d, i) => (!i ? '-0.4em' : '1.4em'),
          },
        },
        all: {
          attr: {
            y: (d, i) => (!i ? -this._scaleR(maxValue) : this._scaleR(maxValue)),
          },
          text: (d) => this.numberFormat(d || 0),
        },
      })
    }
    if (!this._isWarn) {
      // 第一种方式，进行重绘
      // 重新绘制标题单位
      // if (this._option.titleText && this._option.titleVisible) {
      //   this.drawTitle(this._option)
      // }
      // if (this._option.unitContent && this._option.unitVisible) {
      //   this.drawUnit(this._option)
      // }
      // 第二种方式，显示隐藏的标题单位
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        // 一部分隐藏，不再进行重绘，因为改数据不可能改变标题和单位
        this.container.select(x).attr('display', 'block')
      })
      // 将关键key置为false
      this._isWarn = false
      // 删除告警dom
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
    // // 动画开关控制
    // const enableEnterAnimation = this.config('enableEnterAnimation')
    // // 动画时间
    // const enterAnimationDuration = this.config('enterAnimationDuration')
    const enableEnterAnimation = true
    // 动画时间
    const enterAnimationDuration = 2000
    if (enableEnterAnimation) {
      // 弧动画
      this._arcContainer.selectAll('.wave-semicircle-arc').setAnimation({
        style: {
          transform: {from: 'scale(0)', to: 'scale(1)'},
        },
        duration: enterAnimationDuration,
      })
      // 值动画
      this._arcContainer.selectAll('.wave-semicircle-value').setAnimation({
        style: {
          opacity: 1,
        },
        // 值的入场动画在柱子和折线动画完成之后 所以他需要等待一会
        delay: enterAnimationDuration,
        duration: enterAnimationDuration,
        onEnd: () => {
          // 动画结束后将组建状态设置为就绪
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

Semicircle.version = '__VERSION__'
