import * as d3 from 'd3'
import Base from '../base'

const {drawAxisX, drawAxisY, formatMoney, getTextHeight, getTextWidth} = Base

const defaultOption = {
  margins: {top: 80, left: 80, bottom: 50, right: 80},
  textColor: 'black',
  gridColor: 'gray',
  title: '基础河流图',
  animateDuration: 1000,

  hasArea: true,
  areaOpacity: 0.2,
  lineWidth: 3,
  curve: false,
  nodeVisible: 5,
  dashed: 0,
  valueVisible: false,
  circleWidth: 0,
  axisXKey: 'label',
  valueKey: ['value', 'value1'],
  valueSize: 12,
  valueColor: 'rgba(255, 255, 255, 0.65)',
  interactionType: 'group',
  tooltipVisible: false,
  tooltipEventType: 'hover',
  _type: 'canLayout',
}

export default class River extends Base {
  static key = 'river'

  constructor(option) {
    super(option, defaultOption)
    // 所有和数据相关的必须放在_data中
    // this._option = {...this._option, ...option}
    this._data = {}
    this.root.attr('class', 'wave-line')

    this.drawAxisX = drawAxisX
    this.drawAxisY = drawAxisY
    this.formatMoney = formatMoney
    this.getTextHeight = getTextHeight
    this.getTextWidth = getTextWidth
  }

  drawFallback() {
    // 默认显示数据
    const data = {}
    this.data(data)
    this.root.style('opacity', 0.5)
    this.draw({redraw: true})
    this._isWarn = false
  }

  /**
   * 处理数据和所有可变的内容
   * 可变 - 包括数据本身以及所有可能会在数据更新时发生改变的类容都是可变的，还包括颜色、及依赖数据所计算的其他内容
   * @param  {object} data: IDataStructure 源数据
   * @return {object}                      图表实例
   */
  data(data) {
    this._data = data
    this._label = data.label

    // 最小值/最大值
    this.minValue = 0
    this.maxValue = 0
    data.value.map((item) => {
      item.data.map((item2) => {
        if (this.minValue === 0) {
          this.minValue = Number(item2)
        } else {
          this.minValue = Math.min(this.minValue, Number(item2))
        }
        this.maxValue = Math.max(this.maxValue, Number(item2))
      })
    })

    // 颜色
    this._colors = this.getColor(data.value)
    return this
  }

  draw({redraw}) {
    if (redraw === true) {
      this.root.html('')
    }
    !this._isWarn &&
      this.drawLegends({
        legends: this._data.value.map((item, index) => ({
          label: item.name,
          color: this._colors[index],
        })),
        // legendVisible: true,
      })

    // 河流图容器
    this.riverContainer = this.root.append('g').attr('class', '.wave-river')

    // 更新图表
    this.update()

    // 入场动画
    !this._isWarn && this.animation()

    if (!this._isWarn) {
      this.root.style('opacity', 1)
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }
  }

  /**
   * 图表更新
   * 在计算好可变（data）和不可变（deaw）后可以利用计算的结果来绘制和更新图表了
   * @return {object} 图表实例
   */
  update() {
    // 层的总数
    const layerCount = this._data?.value?.length || 0
    // 每层的样本数目
    const dataCount = this._data?.value ? this._data?.value[0]?.data.length || 0 : 0
    // 每层的颠簸总数
    // const bumpyCount = 100
    // x
    this._scaleX = d3
      .scaleLinear()
      .domain([0, dataCount - 1])
      .range([0, this.mainWidth])
    this.baseDrawAxisX({
      rangeValue: this.mainWidth,
      domain: this._label,
    }).scale

    // y
    this._scaleY = d3.scaleLinear().domain([this.minValue, this.maxValue]).range([this.mainHeight, 0])

    this.drawAxisY({
      scale: this._scaleY,
    })

    const axisHeight = this.mainHeight
    // const axisWidth = this.mainWidth

    // 画布
    this._svg = this.root.append('svg').attr('width', this.mainWidth).attr('height', this.mainHeight)

    const stack = d3.stack().keys(d3.range(layerCount)).offset(d3.stackOffsetWiggle)

    const layers = stack(d3.transpose(this._data.value.map((item) => item.data)))

    // 定义x轴比例尺
    const x = this._scaleX

    const y = d3
      .scaleLinear()
      // 定义定义域
      .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
      // 定义值域
      .range([axisHeight, 0])

    const area = d3
      .area()
      .x((d, i) => {
        return x(i)
      })
      .y0((d) => {
        return y(d[0])
      })
      .y1((d) => {
        return y(d[1])
      })
    this._svg
      .selectAll('path')
      .data(layers)
      .enter()
      .append('path')
      .attr('class', 'wave-river-path')
      .attr('d', area)
      .attr('fill', (d, i) => this._colors[i])

    // 获取堆栈数据矩阵的最大值
    function stackMax(layer) {
      return d3.max(layer, (d) => {
        return d[1]
      })
    }

    // 获取堆栈数据矩阵的最小值
    function stackMin(layer) {
      return d3.min(layer, (d) => {
        return d[0]
      })
    }
  }

  // 该方法用于生成长度为n的数组，其中通过m次颠簸，即调用dump(a,n)方法来变换a数组,最终返回变换后的a数组
  bumps(n, m) {
    const a = []
    let i
    for (i = 0; i < n; i += 1) a[i] = 0
    for (i = 0; i < m; i += 1) this.bump(a, n)
    return a
  }

  // 该方法通过一定的随机数的运算来变换数组a的值
  bump(a, n) {
    const x = 1 / (0.1 + Math.random())
    const y = 2 * Math.random() - 0.5
    const z = 10 / (0.1 + Math.random())
    for (let i = 0; i < n; i += 1) {
      const w = (i / n - y) * z
      // eslint-disable-next-line no-param-reassign
      a[i] += x * Math.exp(-w * w)
    }
  }

  /**
   * 图表动画
   * 这里仅处理入场动画和轮播动画
   * @return {object} 图表实例
   */
  animation() {
    // 动画开关控制
    const enableEnterAnimation = false
    // const enableEnterAnimation = this.config('enableEnterAnimation')
    // 动画时间
    const enterAnimationDuration = this.config('enterAnimationDuration')
    // 是否显示节点数值
    // const valueVisible = this.config('valueVisible')

    if (enableEnterAnimation) {
      // 折线入场动画
      this._svg.selectAll('.wave-river-path').setAnimation({
        style: {
          transform: {
            from: 'scaleX(0)',
            to: 'scaleX(1)',
          },
        },
        duration: enterAnimationDuration,
        onEnd: () => {
          this.ready()
        },
      })
    } else {
      // 更改图标状态为就绪
      this.ready()
    }
    return this
  }

  destroy() {
    this._option.container.innerHTML = ''
  }

  onResult(value) {
    this.rsDiv.innerHTML = JSON.stringify(value)
  }
}
