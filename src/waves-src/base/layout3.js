import {isWindows, getTextHeight, getTextWidth} from '../util'

const TITLE_ALIGN = [{
  key: 'LEFT',
  value: '首端',
}, {
  key: 'CENTER',
  value: '居中',
}, {
  key: 'RIGHT',
  value: '末端',
}]

const titleDefaultOption = {
  titleHeight: 0,
  titleSize: 20,
  titleColor: 'white',
  titleText: ' ',
  titleY: 0,
  titleGap: 0,
  titlePosition: 'LEFT',
  titleVisible: true,
  zoomInSize: 0,
  zoomOutSize: 0,
}

const unitDefaultOption = {
  unitWidth: 0,
  unitHeight: 0,
  unitSize: 12,
  unitColor: 'white',
  unitContent: ' ',
  unitY: 0,
  unitVisible: true,
}

// 默认值
const defaultOption = {padding: 0, ...titleDefaultOption, ...unitDefaultOption}

// 绘制主绘图区域
export function drawLayout() {
  const option = {...defaultOption, ...this._option}
  const {
    titleVisible,
    unitVisible,
  } = option

  // padding从此处取
  const padding = this._extendPadding()

  let titleText = null
  if (titleVisible) {
    titleText = option.titleText.replace(/^\s*|\s*$/g, '')
  }
  let unitContent = null
  if (unitVisible) {
    unitContent = option.unitContent.replace(/^\s*|\s*$/g, '')
  }

  // 绘制标题
  if (titleText && titleVisible) {
    this.drawTitle(option)
  } else {
    this._option.titleWidth = defaultOption.titleWidth
    this._option.titleHeight = defaultOption.titleHeight
  }

  // 绘制单位
  if (unitContent && unitVisible) {
    this.drawUnit(option)
  } else {
    this._option.unitWidth = defaultOption.unitWidth
    this._option.unitHeight = defaultOption.unitHeight
  }
  
  // 主体区域的宽高，图例的影响在图例中计算
  const titleUnitHeight = this.config('titleHeight') + this.config('unitHeight')
  this.mainWidth = this.containerWidth - padding[1] - padding[3]
  this.mainHeight = this.containerHeight - padding[0] - padding[2] - titleUnitHeight

  // 创建图表根节点g元素，g节点只受padding影响
  this.root = this.svg.append('g')
    .attr('transform', `translate(${padding[3]}, ${padding[0] + titleUnitHeight})`)
    .attr('width', this.mainWidth)
    .attr('height', this.mainHeight)

  // 记录偏移
  Object.assign(this, {
    translateX: padding[3],
    translateY: padding[0],
  })
}

// 绘制title
export function drawTitle(option) {
  const {
    titleSize,
    titleColor,
    titleText,
    titleY,
    titlePosition,
  } = option

  // 影响顶层布局的 title 宽高属性
  this._option.titleWidth = getTextWidth(titleText, this.fontSize(titleSize))
  this._option.titleHeight = getTextHeight(this.fontSize(titleSize)) + titleY
  
  this.container.select('.wave-title').remove()
  this.svg.append('text')
    .attr('class', 'wave-title')
    .attr('dominant-baseline', 'hanging')
    .attr('font-size', this.fontSize(titleSize))
    .attr('fill', titleColor)
    .attr('x', 0)
    .text(titleText)
    .textHack()

  const title = this.container.select('.wave-title')
  if (titlePosition === TITLE_ALIGN[1].key) {
    title._groups[0][0].setAttribute('x', `${(this.containerWidth - this.config('titleWidth')) / 2}`)
  } else if (titlePosition === TITLE_ALIGN[2].key) {
    title._groups[0][0].setAttribute('x', `${this.containerWidth - this.config('titleWidth')}`)
  }

  // 解决window系统上单位和title紧挨问题
  if (isWindows()) {
    option.titleHeight *= 1.25
  }
}

/**
 * 绘制单位
 *
 * @param {d3.Selection<d3.BaseType, any, HTMLElement, any>} svg
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @memberof Layout
 */
export function drawUnit(option) {
  const {
    unitSize,
    unitColor,
    unitContent,
    unitY,
  } = option

  const text = this.svg.append('text')
    .attr('class', 'wave-unit')
    .attr('dominant-baseline', 'hanging')
    .attr('font-size', this.fontSize(unitSize))
    .attr('fill', unitColor)
    .attr('x', 0)
    .attr('y', this.config('titleHeight'))
    .text(unitContent)

  if (text) {
    (text).textHack()
  }

  // 影响顶层布局的 unit 宽高属性
  this._option.unitWidth = getTextWidth(unitContent, this.fontSize(unitSize))
  this._option.unitHeight = getTextHeight(this.fontSize(unitSize)) + unitY

  // 解决window系统上单位和title紧挨问题
  if (isWindows()) {
    option.unitHeight *= 1.25
  }
}
