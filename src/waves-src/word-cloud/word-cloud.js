import * as d3 from 'd3'
import Base from '../base'
import {dataUtil, formatMoney} from '../util'
import d3cloud from './cloud'
import {Shake} from '../base/animation'

const {drawAxisY, getTextHeight, getTextWidth, drawTitle, drawUnit} = Base

const cloud = d3cloud

const STATIC = {
  LAYOUT_TYPE: [
    {
      key: 'ARCHIMEDEAN',
      value: '阿基米德',
    },
    {
      key: 'RECTANGULAR',
      value: '长方形',
    },
  ],
}

// 默认配置
const defaultOption = {
  fontSizeRange: [null, 20],
  opacityRange: [0.8, 1],
  layoutType: STATIC.LAYOUT_TYPE[0].key,
  cloudPadding: 7,
  cloudRotate: 0,

  labelKey: 'name',
  typeKey: 'type',
  valueKey: 'value',
  _type: 'canLayout',
}

export default class WordCloud extends Base {
  static key = 'wordCloud'

  constructor(option) {
    super(option, defaultOption)
    // this.state = COMPONENT.STATE.RENDER
    this._data = {}
    this.root.attr('class', 'wave-cloud')

    this.drawAxisY = drawAxisY
    this.formatMoney = formatMoney
    this.drawTitle = drawTitle
    this.drawUnit = drawUnit
    this.getTextHeight = getTextHeight
    this.getTextWidth = getTextWidth
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
    const source = dataUtil.transform(
      [this.config('labelKey'), this.config('typeKey')],
      [[this.config('valueKey')]],
      data
    )
    const datas = dataUtil.classify(source)
    // 图例
    const legends = []

    // 如果只有一个维度 那么颜色个数将按照词组个数来 否则按照第二个维度标签个数来
    let color = {}
    if (datas.length === 1) {
      color = this.getColor(datas[0].labels.length)
    } else {
      const colors = this.getColor(datas[1].labels.length)
      datas[1].labels.forEach((d, i) => {
        color[d.label] = colors[i]
        legends.push({
          label: d.label,
          color: colors[i],
        })
      })
    }
    this._data.data = datas[0].labels
    this._data.color = color
    this._data.maxValue = dataUtil.maxValue(source)[source.unit[0]]
    this._data.legends = legends
    this._data.colorDimension = source.dimension.length === 2
    return this
  }

  // 报错之后重绘
  drawFallback() {
    this.root.style('opacity', 0.5)

    // 容器 默认居中
    this._content = this.root
      .append('g')
      .attr('class', 'wave-cloud-clouds')
      .attr('transform', `translate(${this.mainWidth / 2}, ${this.mainHeight / 2})`)
    this._content.append('text').attr('font-size', 22).attr('text-anchor', 'middle').text('暂无数据')
  }

  /**
   * 绘制图表和处理所有不可变的内容
   * 不可变 - 比如绘制图表的框架结构、计算一些数据发生改变但是不会被影响的内容
   * @return {object} 图表实例
   */
  draw({redraw}) {
    if (redraw === true) {
      this.root.style('opacity', 1)
      this.root.html('')
    }
    if (!this._data.source) {
      console.error('Data cannot be empty')
      return
    }

    // 图例
    this.drawLegends({legends: this._data.legends})

    // 容器 默认居中
    this._content = this.root
      .append('g')
      .attr('class', 'wave-cloud-clouds')
      .attr('transform', `translate(${this.mainWidth / 2}, ${this.mainHeight / 2})`)

    // 更新图表
    // 由于更新时异步 所以需要回调监听更新
    this.update(() => {
      // 入场动画
      this.animation()
    })

    // return this
  }

  /**
   * 图表更新
   * 在计算好可变（data）和不可变（draw）后可以利用计算的结果来绘制和更新图表了
   * @return {object} 图表实例
   */
  update(callback) {
    const fontSizeRange = this.config('fontSizeRange').slice(0)
    const opacityRange = this.config('opacityRange')
    const cloudPadding = this.config('cloudPadding')
    const cloudRotate = this.config('cloudRotate')
    const layoutType = this.config('layoutType')
    const size = Math.min(this.mainWidth, this.mainHeight)
    const {maxValue, data, color, colorDimension} = this._data

    fontSizeRange[0] = this.fontSize(fontSizeRange[0] || size / 110)
    fontSizeRange[1] = this.fontSize(fontSizeRange[1] || size / 20)

    // 字号比例尺
    this._scaleSize = d3.scaleLinear().range(fontSizeRange).domain([0, maxValue])

    // 透明度比例尺
    this._scaleOpacity = d3.scaleLinear().range(opacityRange).domain([0, maxValue])

    // 报错之后重绘，具体说明看line
    if (!this._isWarn) {
      const canUnRemoveChart = ['.wave-title', '.wave-unit']
      canUnRemoveChart.forEach((x) => {
        this.container.select(x).attr('display', 'block')
      })
      this.container.select('.wave-warnInfo').remove()
    }

    // 计算词组颜色、大小、透明度
    data.forEach((d, i) => {
      const item = d
      const v = dataUtil.getNumber(d.data[0].values[0])
      item.text = d.label
      item.opacity = this._scaleOpacity(v)
      item.size = this._scaleSize(v)
      item.color = colorDimension ? color[dataUtil.getString(d.data[0].dimensions[1])] : color[i]
    })

    // 计算布局信息
    const layout = cloud()
      .size([this.mainWidth, this.mainHeight])
      .words(data)
      .padding(cloudPadding)
      .rotate(cloudRotate)
      .font("'PingFang SC', 'Helvetica Neue', Helvetica, Tahoma, Helvetica, sans-serif")
      .fontSize((d) => d.size)
      .spiral(layoutType)
      .on('end', (ws) => {
        /* 更新 */
        this._content.update('text', {
          data: ws,
          dataKey: (d) => d.text,

          enter: {
            attr: {
              'text-anchor': 'middle',
              'dominant-baseline': 'middle',
              'font-size': 0,
            },
          },
          transitionAll: {
            style: {
              transform: (d) => `translate(${d.x}px, ${d.y}px) rotate(${d.rotate}deg)`,
            },
          },
          attr: {
            opacity: (d) => d.opacity,
            fill: (d) => d.color,
            'font-size': (d) => d.size,
          },
          text: (d) => d.text,
        })

        // 执行回调
        typeof callback === 'function' && callback()
      })

    layout.start()
    return this
  }

  /**
   * 图表动画
   * 这里仅处理入场动画和轮播动画
   * @return {object} 图表实例
   */
  animation() {
    // 动画开关控制
    const enableEnterAnimation = this.config('enableEnterAnimation')
    // 动画时间
    const enterAnimationDuration = this.config('enterAnimationDuration')
    // 轮播动画
    const enableLoopAnimation = this.config('enableLoopAnimation')
    // 单次轮播时间
    const loopAnimationDuration = this.config('loopAnimationDuration')
    // 单次轮播时间
    const maxOffset = this.config('maxOffset')

    this.shake = new Shake({
      targets: this._content.selectAll('text'),
      duration: loopAnimationDuration,
      translateRange: [0, maxOffset],
    })

    if (enableEnterAnimation) {
      this._content.selectAll('text').setAnimation({
        style: {
          transform: {
            from: (d) => `translate(${d.x}px, ${d.y}px) rotate(${d.rotate}deg) scale3d(0, 0, 1)`,
            to: (d) => `translate(${d.x}px, ${d.y}px) rotate(${d.rotate}deg) scale3d(1, 1, 1)`,
          },
        },
        duration: enterAnimationDuration,
        onEnd: () => {
          this.ready()
          enableLoopAnimation && this.shake.play()
        },
      })
    } else if (enableLoopAnimation) {
      this.ready()
      this.shake.play()
    } else {
      // 更改图表状态为就绪
      this.ready()
    }

    return this
  }

  destroy() {
    this.shake.destory()
    this.container.html('')
  }
}

WordCloud.version = '__VERSION__'
