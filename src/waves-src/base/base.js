import * as d3 from 'd3'
import interpolate from 'color-interpolate'
import * as util from './util'
import * as labelAxisX from './label-axis-x'
import * as valueAxisY from './value-axis-y'
import * as legend from './legend'
import * as legend2 from './legend2'
import * as tooltip from './tooltip'
import expand from './d3-expand'
import * as Layout2 from './layout2'
import * as Layout3 from './layout3'
import drawValueAxisX from './value-axis-x'
import drawLabelAxisY from './label-axis-y'
import {generateColorList} from '../util'
import createEvent from '../../common/event'
import tip from '../../components/tip'
import {chromaScale} from './chroma'
import {EmptyAnimation} from './animation'

// TODO: 后面处理
// const interpolate = require('color-interpolate')
const {getValueByPath, isArray} = util
const {assign} = Object

window.d3 = d3

// 通用参数
const commonOption = {
  enableEnterAnimation: true,
  enterAnimationDuration: 2000,
  loopAnimation: true,
  // 必选 容器
  container: null,

  // 容器宽度
  width: null,

  // 容器高度
  height: null,

  // 是否自动缩放
  // 当autoScale设置为true时，如果也同时设置了width和height，则宽高值作为viewBox的初始值，而不是真实的px值
  autoScale: false,

  // 容器的内边距
  padding: [0],

  // 基准字号
  baseFontSize: 1,

  // 数值千分位
  numberFormat: false,

  // 默认主题色：琉璃盏
  // themeColors: ['#2A43FF', '#0B78FF', '#119BFF', '#3EBFDA', '#6CDDC3', '#B5E4AA', '#FFEA92', '#FFBD6D', '#FD926D'],
}

// 超类构造函数初始化了以下属性，子类实例可以直接调用
//   - containerWidth    父容器的宽
//   - containerHeight   父容器的高
//   - root              图表根节点g元素
//   - padding           内边距值(四个值的数组)
//   - mainWidth         主图区域的宽度
//   - mainHeight        主图区域的高度
//
// 超类提供了以下原型方法，子类实例可以直接调用
//   - config()          获取配置参数
//   - destroy()         销毁实例
export default class Base {
  constructor(option = {}, defaultOption = {}) {
    this.lib = 'wave'
    this.key = this.constructor.key || 'unnamedWave'
    this._option = option
    this._defaultOption = assign(defaultOption, commonOption)

    // 在d3原型上扩展一些方法
    // 为啥要在这里扩展？因为container这个d3节点是从外部传入 仅仅扩展waves本身的d3是没用的
    this.expandD3(option.container)

    this._isWarn = false
    // 所有图表都强制传入容器元素
    if (!this._option.container) {
      console.log('`container` is required for WaveX constructor')
    }

    this.container = d3.select(this._option.container)

    // 重复实例化到同一个元素，保证没有残留
    this.container.html('')

    // 取出容器的宽高
    this.containerWidth = this.config('width') || +this.container.style('width').match(/^\d*/)[0]
    this.containerHeight = this.config('height') || +this.container.style('height').match(/^\d*/)[0]
    const {containerWidth, containerHeight} = this

    // 创建svg节点
    const svg = this.container.append('svg')
    // 如果不在预览模式，交互动画无效，关闭动画
    if (!this._option.isPreview) {
      // 开发时可以先把这句话去掉
      // svg.style('pointer-events', 'none')
      this._option.enableEnterAnimation = false
      this._option.loopAnimation = false

      // 新的动画属性
      this._option.enableLoopAnimation = false
    }

    // 为了布局将svg挂到实例上
    this.svg = svg

    // 自定缩放时，svg不设置宽高，只设置viewBox
    // 画这个svg为所有图表的通用逻辑，故放在这里
    if (this.config('autoScale') === true) {
      // 因为内部的root的宽高是撑满的，所以这一行不设置也可以
      // svg.attr('preserveAspectRatio', 'xMidYMid meet')
      svg.attr('viewBox', `0,0,${containerWidth},${containerHeight}`)
    } else {
      svg.attr('width', containerWidth).attr('height', containerHeight)
    }

    this._baseFontSize = this.config('baseFontSize')
    this._numberFormat = this.config('numberFormat')

    this.isDev = false

    // 当组件为网格时，整个图表不受padding影响且不会进行布局
    if (this._defaultOption._type === 'canUnLayout') {
      this.mainWidth = this.containerWidth
      this.mainHeight = this.containerHeight
      // 创建图表根节点g元素
      this.root = svg.append('g').attr('width', containerWidth).attr('height', containerHeight)
    } else {
      // 将布局方法，画标题，画单位的方法挂载到实例上，
      // Q：什么时候画标题和单位？A:单位和标题独立在图表之外不影响图表不依赖图表，应该在公共的方法也就是base中画完
      // Q：那XY轴，图例为什么不在base中画？A：XY轴和图例依赖于图表的数据，在base中无法支撑他们的实现
      this.drawLayout = this.isDev ? Layout3.drawLayout : Layout2.drawLayout
      this.drawTitle = this.isDev ? Layout3.drawTitle : Layout2.drawTitle
      this.drawUnit = this.isDev ? Layout3.drawUnit : Layout2.drawUnit
      this.drawLegends = this.isDev ? legend2.drawLegends : legend.drawLegends
      this.drawLayout()
    }

    this.tip = tip
    this.event = createEvent(`${this.lib}.${this.key}`)
    this.tooltip = window.waveview.tooltip
    this.tooltipPosition = {}
  }

  // 组件渲染完成后触发
  ready() {
    this.state = 'ready'
    this.event.fire('ready')
  }

  /**
   * 在d3原型上扩展一些方法
   * @param {object} select d3节点
   */
  expandD3(select) {
    if (select) {
      expand(Object.getPrototypeOf(select))
    }
  }

  // 获取参数的方法
  config(path) {
    const optionValue = getValueByPath(path, this._option)
    return optionValue !== undefined ? optionValue : getValueByPath(path, this._defaultOption)
  }

  // 展开padding值
  // 添加`padding`属性
  _extendPadding() {
    let padding = this.config('padding')

    if (padding.length === 0) {
      padding = [10]
    } else {
      // TODO:
      // for (let i = 0, l = padding.length; i < l; i++) {
      //   padding[i] = Number(padding[i])
      //   if (!isNumber(padding[i])) {
      //     throw new Error('Padding Values Must Be Number')
      //   }
      // }
    }

    if (padding.length === 1) {
      padding = [padding[0], padding[0], padding[0], padding[0]]
    } else if (padding.length === 2) {
      padding = [padding[0], padding[1], padding[0], padding[1]]
    } else if (padding.length === 3) {
      padding = [padding[0], padding[1], padding[2], padding[1]]
    }
    return (this.padding = padding)
  }

  // Tooltip 轮播
  loopTooltip(eventElements) {
    const enableLoopTooltip = this.config('enableLoopTooltip')
    const loopTooltipDuration = this.config('loopTooltipDuration')
    const loopTooltipDelay = this.config('loopTooltipDelay')

    // 之前生成过计时器动画，需要先销毁
    if (this.loopTooltipAnimation) {
      this.loopTooltipAnimation.destory()
      this.loopTooltipAnimation = null
    }

    if (enableLoopTooltip && this._option.isPreview) {
      let nextActive = 0
      this.loopTooltipAnimation = new EmptyAnimation({
        type: 'timer',
        duration: loopTooltipDuration + loopTooltipDelay,
        loop: true,
      })
      this.loopTooltipAnimation.event.on('end', () => {
        eventElements.each((data, index, elements) => {
          d3.select(elements[index]).on('mouseout')(data, index, elements)
          if (index === nextActive) {
            const {x, y, width, height} = elements[index].getBoundingClientRect()
            // tooltipPosition 需要由组件自己传递
            this.tooltipPosition = {
              left: x + width / 2,
              top: y + height / 2,
            }
            setTimeout(() => {
              d3.select(elements[index]).on('click')(data, index, elements)
              d3.select(elements[index]).on('mouseover')(data, index, elements)
            }, loopTooltipDelay)
          }
        })
        nextActive = (nextActive + 1) % eventElements._groups[0].length
      })
      this.loopTooltipAnimation.play()
    }
  }

  // 绘制参考线
  drawReferenceLine({scaleX, scaleY}) {
    const lineWeight = 2
    const offset = 5
    // Y轴参考线
    if (this.config('showReferenceLineY') && scaleY && !this._isWarn) {
      const value = this.config('referenceLineValueY')
      const size = this.fontSize(this.config('legendSize') || 12)
      const lineContainer = this.root.append('g').attr('transform', `translate(0, ${scaleY(value)})`)
      // 线
      lineContainer
        .append('line')
        .attr('class', 'wave-reference-line')
        .attr('stroke', this.config('referenceLineColorY'))
        .attr('stroke-width', this.fontSize(lineWeight))
        .attr('stroke-dasharray', '5, 5')
        .attr('x2', this.mainWidth)
      // 数值和背景
      lineContainer
        .append('rect')
        .attr('class', 'wave-reference-line-tag')
        .attr('x', this.mainWidth + offset)
        .attr('y', -util.getTextHeight(size) / 2)
        .attr('width', util.getTextWidth(value, size) + 10)
        .attr('height', util.getTextHeight(size))
        .attr('fill', this.config('referenceLineColorY'))
      lineContainer
        .append('text')
        .attr('class', 'wave-reference-line-text')
        .attr('x', this.mainWidth + 5 + offset)
        .attr('y', util.getTextHeight(size) / 4)
        .attr('fill', this.config('legendColor'))
        .style('font-size', `${size}px`)
        .text(value)
    }
    // X轴参考线
    if (this.config('showReferenceLineX') && scaleX && !this._isWarn) {
      const value = this.config('referenceLineValueX')
      const size = this.fontSize(this.config('legendSize') || 12)
      const lineContainer = this.root.append('g').attr('transform', `translate(${scaleX(value)}, 0)`)
      // 线
      lineContainer
        .append('line')
        .attr('class', 'wave-reference-line')
        .attr('stroke', this.config('referenceLineColorX'))
        .attr('stroke-width', this.fontSize(lineWeight))
        .attr('stroke-dasharray', '5, 5')
        .attr('y2', this.mainHeight)
      // 数值和背景
      lineContainer
        .append('rect')
        .attr('class', 'wave-reference-line-tag')
        .attr('x', -(util.getTextWidth(value, size) + 10) / 2)
        .attr('y', -util.getTextHeight(size) - offset)
        .attr('width', util.getTextWidth(value, size) + 10)
        .attr('height', util.getTextHeight(size))
        .attr('fill', this.config('referenceLineColorX'))
        .attr('transform', 'translate(-50%, 0')
      lineContainer
        .append('text')
        .attr('class', 'wave-reference-line-text')
        .attr('x', 5 - (util.getTextWidth(value, size) + 10) / 2)
        .attr('y', (util.getTextHeight(size) / 4) * 3 - util.getTextHeight(size) - offset)
        .attr('fill', this.config('legendColor'))
        .style('font-size', `${size}px`)
        .text(value)
    }
  }

  fontSize(n) {
    return this._baseFontSize * n
  }

  // 数值千分位
  numberFormat(n) {
    // return this._numberFormat ? d3.format(',')(n) : n
    let newNumber = n
    if (this._numberFormat) {
      newNumber = d3.format(',')(n)
    } else if (this.config('decimalNumber') !== undefined) {
      newNumber = parseFloat(Number(n).toFixed(this.config('decimalNumber')))
    }
    return newNumber
  }

  destroy() {
    this.container.html('')
  }

  // 定义组件如何在视图中报错
  // @param text {string} 错误提示文本
  // @param onTextClick {function} 点击错误文本时，可以往控制台打印自定义信息
  warn({text}) {
    this.root.html('')
    // xy轴，单位，标题，图例,报错信息一次全部干掉
    // 这里有两种实现方式，一种时html（‘’）一种时remove（），目测remove（）性能消耗会小，因为在组件内部也会进行一次remove（）
    const canRemoveWave = ['.wave-axis-y', '.wave-axis-x', '.wave-legends', '.wave-warnInfo']
    canRemoveWave.forEach((x) => {
      // 一部分删除
      this.container.select(x).remove()
    })

    const canUnRemoveWave = ['.wave-title', '.wave-unit']
    canUnRemoveWave.forEach((x) => {
      // 一部分隐藏，不再进行重绘，因为改数据不可能改变标题和单位
      this.container.select(x).attr('display', 'none')
    })

    const padding = this._extendPadding()
    this.root
      .attr('style', 'pointer-events: none;')
      .append('foreignObject')
      .attr('transform', `translate(${-padding[3]}, ${-padding[0]})`)
      .attr('class', 'warning')
      .attr('width', this.containerWidth)
      .attr('height', this.containerHeight)

    // 预览状态下使用各自的数据错误方法
    // 加入是否warn判断，用来给后面的图判断是否需要重绘，
    // 如X轴，标签数据不变时，不会进行重绘
    this._isWarn = true

    if (this._option.isPreview) {
      this.drawFallback()
    } else {
      // this.drawFallback()
      tip.error({content: text})
      // ReactDOM.render(
      //   <Warning onClick={onTextClick} content={text} height={this.containerHeight} />,
      //   waring._groups[0][0]
      // )
    }
    this._isWarn = false
  }

  // base上挂载一个记录未定义drawFallback的方法，各自组件去覆盖此方法
  drawFallback() {
    // log.error(this, 'drawFallback未定义')
  }

  // 需要子类去扩展的方法，判断数据是否为空，
  // 如下面的数据，对sankey来说依然是空数据，因为links为空
  // const emptySankeyData = {
  //   nodes: {
  //     a1: {id: 'a1', name: 'xxx'},
  //   },
  //   links: [],
  // }
  isValidData() {
    return true
  }

  /**
   * 快速绘制X轴
   * @param {object} options 配置项
   *                 options.scale      如果传了那么会无视其他选项
   *                 options.rangeValue X轴宽度
   *                 options.domain     scale.domain
   */
  baseDrawAxisX(options) {
    const {scale} = options
    const {rangeValue} = options
    const {domain} = options
    const {barWidth = 0} = options
    const scaleX =
      scale ||
      d3
        .scalePoint()
        .range([0 + barWidth, rangeValue - barWidth])
        .domain(domain)
        .padding(0)
    this.drawAxisX({
      scale: scaleX,
    })
    return {
      scale: scaleX,
    }
  }

  /**
   * 快速绘制Y轴
   * @param {object} options 配置项
   *                 options.rangeL  左轴range 如果没传将使用 [this.mainHeight, 0]
   *                 options.rangeR  右轴range 如果是有效值（true）那么会绘制右轴 如果有效值是数组那么会直接用该值绘制 否则使用 [this.mainHeight, 0]
   *                 options.domainL 左轴domain
   *                 options.domainR 右轴domain
   */
  baseDrawAxisY(options) {
    const {rangeL} = options
    const {rangeR} = options
    const {domainL} = options
    const {domainR} = options
    const scaleL = d3
      .scaleLinear()
      .range(rangeL || [this.mainHeight, 0])
      .domain(domainL)
    const scaleR = domainR
      ? d3
          .scaleLinear()
          .range(isArray(rangeR) ? rangeR : [this.mainHeight, 0])
          .domain(domainR)
      : undefined

    this.drawAxisY({
      scale: scaleL,
      rightScale: scaleR,
    })

    // 绘制参考线
    this.drawReferenceLine({scaleY: scaleL})

    return {
      scaleYL: scaleL,
      scaleYR: scaleR,
    }
  }

  getColor(colorAmount, rangeColors = null) {
    const colorAmounts = isArray(colorAmount) ? colorAmount : [colorAmount]
    let colors = this.config('themeColors')
    // 此处对主题色进行筛选使其更符合设计师的选色逻辑
    // 颜色数量小于等于三时
    if (colorAmounts[0] <= 3) {
      colors = colors.slice(2, 7)
    }
    // 颜色数量等于4时
    if (colorAmounts[0] === 4) {
      colors = colors.slice(2)
    }

    // 是否自选颜色
    if (this.config('useColors')) {
      // 返回渐变色比例尺
      if (this.config('rangeColors')) {
        if (Array.isArray(this.config('rangeColors')[0])) {
          return chromaScale(this.config('rangeColors'), colorAmount)
        }
      }

      colors = this.config(this.config('checkColorModel') || 'customColors') || this.config('rangeColors')
      // 这里可以由自己传一个颜色数组来定义颜色，这边先只允许传一个颜色
      colors = [colors]
    }
    // 如果传入一个rangeColors则使用这个颜色
    if (rangeColors) {
      colors = rangeColors
      if (Array.isArray(rangeColors[0])) {
        return chromaScale(rangeColors, colorAmount)
      }
    }

    colors = generateColorList(colors)
    if (!isArray(colors) || !colors.length) {
      console.error('colors应该传一个颜色数组或二维数组')
      return []
    }
    const colorList = isArray(colors[0]) ? colors : [colors]
    const result = []
    colorAmounts.forEach((amount, index) => {
      const color = colorList[index] || colorList[index - 1]
      if (!color || !color.length || !amount) {
        result.push([])
        return
      }

      // 如果配置的颜色个数和colorAmount相等那么直接返回配置的颜色
      if (amount === color.length) {
        result.push(color)
        // 如果需要的颜色个数和配置的颜色不相等那么进行插值
      } else {
        const interpolateColors = []
        try {
          const compute = interpolate(color)
          const scale = amount > 1 ? 1 / (amount - 1) : 1
          for (let i = 0; i < amount; i++) {
            interpolateColors.push(compute(scale * i))
          }
        } catch (err) {
          // console.log(err)
        }
        result.push(interpolateColors)
      }
    })
    return isArray(colorAmount) ? result : result[0]
  }

  /**
   * 直角坐标系的检验方法
   * @param  {object} data 源数据
   * @return {number}      数据版本 1->1.0,2->2.0,0->错误
   */
  cartesianCoordinateJudgingVersion(data) {
    // 校验数据是否是v1.0 [{label:XX,value:XX,value1:XX},{...}]
    // 数据映射的数据结构和v1.0相同，故version也为1
    if (Array.isArray(data)) {
      if (Object.prototype.hasOwnProperty.call(data[0], 'label')) {
        return 1
      }
    }
    // 检验数据是否为v2.0 {label:[],value:[{name:'',data:[]},{...}]}
    if (Object.prototype.hasOwnProperty.call(data, 'label') && Object.prototype.hasOwnProperty.call(data, 'value')) {
      if (Array.isArray(data.value)) {
        if (data.value.length > 0) {
          if (
            Object.prototype.hasOwnProperty.call(data.value[0], 'name') &&
            Object.prototype.hasOwnProperty.call(data.value[0], 'data')
          ) {
            return 2
          }
        }
      }
    }
    return 0
  }

  /**
   * 直角坐标系数据转换v1.0 -> v2.0
   * @param  {object} data 源数据1.0
   * @return {object}      转换后的数据2.0
   */
  cartesianCoordinateChangeOneToTwo(data) {
    // log.warn('检测到数据为v1.0，建议转换成v2.0，执行转换函数, v1.0 -> v2.0', this)
    const newData = {}
    newData.label = data.map((x) => x.label)
    const keys = Object.keys(data[0]).filter((x) => x !== 'label')
    newData.value = keys.map((x) => {
      return {
        name: x,
        data: data.map((d) => d[x]),
      }
    })
    console.log('转换完毕', newData)
    return newData
  }

  /**
   * 直角坐标系数据校验v2.0
   * @param  {object} sourceData 源数据2.0
   * @return {object}      校验处理后的数据2.0
   */
  cartesianCoordinateCheckData(sourceData) {
    // 深拷贝不影响原数据
    const data = JSON.parse(JSON.stringify(sourceData))
    // 检验数据数量是否相同
    const dataLabelCount = data.label.length
    data.value.forEach((x) => {
      // 数据多了去掉多的
      if (x.data.length > dataLabelCount) x.data = x.data.slice(0, dataLabelCount)
      // 数据少了补0
      while (x.data.length < dataLabelCount) x.data.push(0)
      // 遍历data，将null等值转成0
      x.data = x.data.map((d) => {
        d = Number(d)
        return !d || d === 0 ? 0 : d
      })
    })
    // 校验数据是否重复
    data.label = data.label.map((x, i) => {
      if (data.label.indexOf(x) !== i) {
        data.value.forEach((d) => d.data.splice(i, 1))
        return null
      }
      return x
    })
    // .filter(Boolean)
    return data
  }

  /**
   *
   */
  drawTags() {
    if (!this.tagDatas) {
      return
    }
    const {apiLoopQueries, currentLoopQuery} = this.tagDatas
    this.apiQueriesContainer && this.apiQueriesContainer.remove()
    this.apiQueriesContainer = this.container
      .select('svg')
      .append('foreignObject')
      .attr('class', 'wave-tags')
      .attr('width', this.containerWidth)
      .attr('height', this.containerHeight)
      .attr('pointer-events', 'none')
    // .attr('transform', `translate(0, ${-this.mainHeight}px)`)

    const ul = this.apiQueriesContainer
      .append('xhtml:ul')
      .style('height', '50px')
      .style('width', '100%')
      .style('text-align', 'right')

    const li = ul
      .selectAll('.wave-legend')
      .data(apiLoopQueries)
      .enter()
      .append('xhtml:li')
      .style('list-style', 'none')
      .style('display', 'inline-block')
      .attr('class', 'wave-legend')

    li.append('xhtml:span')
      .text((d) => d.label)
      // .style('font-size', `${size}px`)
      // .style('color', legendColor)
      .style('opacity', (d, i) => (currentLoopQuery === i ? 1 : 0.5))
      .style('cursor', 'pointer')
      .style('margin-left', '10px')
      .style('border-bottom', (d, i) => (currentLoopQuery === i ? '3px solid #09f' : 'none'))
  }
}

Object.assign(Base, util, labelAxisX, valueAxisY, tooltip, {drawValueAxisX, drawLabelAxisY})

Base.version = '__VERSION__'
