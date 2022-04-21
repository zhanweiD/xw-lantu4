/* eslint-disable prefer-destructuring */
import {isWindows, getTextHeight, getTextWidth} from '../util'

const LEGEND_POSITION = [
  {
    key: 'TOP',
    value: '上',
  },
  {
    key: 'RIGHT',
    value: '右',
  },
  {
    key: 'BOTTOM',
    value: '下',
  },
  {
    key: 'TITLE',
    value: '标题栏',
  },
]

const TITLE_ALIGN = [
  {
    key: 'LEFT',
    value: '首端',
  },
  {
    key: 'CENTER',
    value: '居中',
  },
  {
    key: 'RIGHT',
    value: '末端',
  },
]

const titleDefaultOption = {
  titleHeight: 0,
  titleSize: 20,
  titleColor: 'white',
  titleText: ' ',
  titleY: 0,
  titleVisible: true,
  zoomInSize: 0,
  zoomOutSize: 0,
  titleGap: 0,
  titlePosition: 'LEFT',
}

const unitDefaultOption = {
  unitHeight: 0,
  unitSize: 12,
  unitColor: 'white',
  unitContent: ' ',
  unitY: 0,
  unitVisible: true,
}

const defaultOption = {padding: 0, ...titleDefaultOption, ...unitDefaultOption}
/**
 * 绘制主绘图区域
 *
 * @memberof Layout
 */
export function drawLayout() {
  const option = {...defaultOption, ...this._option}
  const {legendVisible, legendY, legendSize, legendPosition, titleVisible, unitVisible} = option
  // padding从此处取
  const padding = this._extendPadding()

  // 主体区域的宽高，即padding之内的宽高，此高度和宽度只受padding的影响，不会再变化
  this.mainWidth = this.containerWidth - padding[1] - padding[3]
  this.mainHeight = this.containerHeight - padding[0] - padding[2]

  // 创建图表根节点g元素，g节点只受padding影响
  this.root = this.svg
    .append('g')
    .attr('transform', `translate(${padding[3]}, ${padding[0]})`)
    .attr('width', this.mainWidth)
    .attr('height', this.mainHeight)

  let legendHeight = 0
  let titleText = null
  if (titleVisible) {
    titleText = option.titleText.replace(/^\s*|\s*$/g, '')
  }

  let unitContent = null
  if (unitVisible) {
    unitContent = option.unitContent.replace(/^\s*|\s*$/g, '')
  }

  // 有图例？
  if (legendVisible) {
    // 如果不放右边需要计算图例高度
    if (legendPosition !== LEGEND_POSITION[1].key) {
      legendHeight = (getTextHeight(this.fontSize(legendSize)) || 0) + (legendY || 0)
    }
  }

  // 绘制标题？
  if (titleText && titleVisible) {
    this.drawTitle(option)
  }

  // 绘制单位？
  if (unitContent && unitVisible) {
    // 如果图例显示并且位置在标题下面那么单位位置应该需要加上图例高度
    if (legendPosition === LEGEND_POSITION[0].key) {
      this._option.unitY = option.titleHeight + legendHeight
    } else {
      this._option.unitY = option.titleHeight
    }
    this.drawUnit(option)
  }

  /* X偏移 */
  this.translateX = padding[3]

  /* Y偏移 */
  // Y跟随着图表变化，也就是说其只受上下的padding影响
  this.translateY = padding[0]
}

/**
 * 绘制title
 *
 * @memberof Layout
 */
export function drawTitle(option) {
  const {titleSize, titleColor, titleText, titleY, titlePosition, titleGap} = option
  // 标题文本大小
  const size = getTextWidth(titleText, this.fontSize(titleSize))
  // const size = this.fontSize(titleSize)
  this.container.select('.wave-title').remove()
  this.svg
    .append('text')
    .attr('class', 'wave-title')
    .attr('dominant-baseline', 'hanging')
    .attr('font-size', this.fontSize(titleSize))
    .attr('fill', titleColor)
    .attr('x', 0)
    .text(titleText)
    .textHack()

  const title = this.container.select('.wave-title')
  const padding = this.padding[1] + this.padding[3]
  if (titlePosition === TITLE_ALIGN[2].key) {
    title._groups[0][0].setAttribute('x', `${this.mainWidth + padding - size + titleGap}`)
  }

  if (titlePosition === TITLE_ALIGN[1].key) {
    title._groups[0][0].setAttribute('x', `${(this.mainWidth + padding - size) / 2 + titleGap}`)
  }
  // 计算标题的高度
  option.titleHeight = getTextHeight(this.fontSize(titleSize)) + titleY

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
// 这里增加了一个offsetY的配置项，原意为控制Y轴的左右移动，暂时使其固定在左上角在标题下
export function drawUnit(option) {
  const {
    unitSize,
    unitColor,
    unitContent,
    // unitY,
    unitOffset,
  } = option

  const text = this.svg
    .append('text')
    .attr('class', 'wave-unit')
    .attr('dominant-baseline', 'hanging')
    .attr('font-size', this.fontSize(unitSize))
    .attr('fill', unitColor)
    .attr('x', unitOffset[0])
    .attr('y', unitOffset[1])
    // .attr('x', 0)
    // .attr('y', this._option.unitY)
    // .attr('transform', `translate(${offsetY}, 0)`)
    .text(unitContent)

  if (text) {
    text.textHack()
  }
  option.unitHeight = getTextHeight(this.fontSize(unitSize)) + unitOffset[1]
  // option.unitHeight = getTextHeight(this.fontSize(unitSize)) + unitY

  // 解决window系统上单位和title紧挨问题
  if (isWindows()) {
    option.unitHeight *= 1.25
  }
}
