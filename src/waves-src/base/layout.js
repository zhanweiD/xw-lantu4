/* eslint-disable prefer-destructuring */
import {isWindows, getTextHeight} from '../util'

const LEGEND_POSITION = [{
  key: 'TOP',
  value: '上',
}, {
  key: 'RIGHT',
  value: '右',
}, {
  key: 'BOTTOM',
  value: '下',
}, {
  key: 'TITLE',
  value: '标题栏',
}]

const titleDefaultOption = {
  titleHeight: 0,
  titleSize: 20,
  titleColor: 'white',
  titleText: 'ss',
  titleY: 0,
  titleVisible: true,
  zoomInSize: 0,
  zoomOutSize: 0,
}

const unitDefaultOption = {
  unitHeight: 0,
  unitSize: 12,
  unitColor: 'white',
  unitContent: 'ss',
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
  const opt = {...defaultOption, ...this._option}
  const {
    legendVisible,
    legendY,
    // width,
    // height,
    fullScreen,
    legendSize,
    legendPosition,
    // legendWidth,
    // artboardHeight,
    titleVisible,
    unitVisible,
  } = opt
  // 向下移动的值，暴露给后图
  this.move = 0
  // 写死的值
  const padding = [0, 0, 40, 0]// this._extendPadding()
  this.mainHeight -= padding[2]
  // const {padding} = this

  const zoomInSize = this.config('zoomInSize') || opt.zoomInSize
  const zoomOutSize = this.config('zoomOutSize') || opt.zoomOutSize
  if (zoomInSize) {
    padding[3] += zoomInSize
  }

  
  let legendHeight = 0
  let legendW = 0
  let maxHeight = 0
  const titleText = opt.titleText.replace(/^\s*|\s*$/g, '')
  const unitContent = opt.unitContent.replace(/^\s*|\s*$/g, '')

  /* 计算容器高度 */
  // eslint-disable-next-line no-constant-condition
  if (!0) {
    // 先把上下填充减掉
    // this.mainHeight = height - padding[0] - padding[2]

    // 有图例？
    if (legendVisible) {
      // 如果放右边需要计算图例的宽度
      if (legendPosition === LEGEND_POSITION[1].key) {
        legendW += opt.legendWidth // Math.max(...this._data.legends.map(l => this.getTextWidth(l.label, this.fontSize(legendSize))))
      } else {
        legendHeight = (getTextHeight(this.fontSize(legendSize)) || 0) + (legendY || 0)
      }
    }
    

    // 绘制标题？
    if (titleText && titleVisible) {
      this.drawTitle(opt)
    }

    // 绘制单位？
    if (unitContent && unitVisible) {
      // 如果图例显示并且位置在标题下面那么单位位置应该需要加上图例高度
      if (legendPosition === LEGEND_POSITION[0].key) {
        this.drawUnit(this.svg, 0, opt.titleHeight + legendHeight, opt)
      } else {
        this.drawUnit(this.svg, 0, opt.titleHeight, opt)
      }
    }

    maxHeight = opt.titleHeight + opt.unitHeight
    

    /* 当图例与（标题 || 单位）共存时并且图例的位置是标题栏时 */
    if (legendPosition === LEGEND_POSITION[3].key) {
      // 如果图例的高度大于标题或单位或标题+单位的高度那么总高度应该减去图例的高度
      // 否则减去标题单位的高度
      if (maxHeight < legendHeight) {
        this.mainHeight -= legendHeight
        // 同时将图向下移动
        this.root
          .attr('transform', `translate(${padding[3]}, ${legendHeight})`)
        this.move = legendHeight
      } else {
        this.mainHeight -= maxHeight
        // 同时将图向下移动
        this.root
          .attr('transform', `translate(${padding[3]}, ${maxHeight})`)
        this.move = maxHeight
      }
    } else {
      // 如果图例在右边， 图例下移标题+单位
      if (legendPosition === LEGEND_POSITION[1].key) {
        this.root
          .attr('transform', `translate(${padding[3]}, ${maxHeight})`)
      }
      // 如果图例不是标题栏位置时必须减去标题和单位的高度
      this.mainHeight -= maxHeight

      // 当图例的位置是 上 或者 下 时必须减去图例的高度
      if (legendPosition === LEGEND_POSITION[0].key || legendPosition === LEGEND_POSITION[2].key) {
        this.mainHeight -= legendHeight
        if (legendPosition === LEGEND_POSITION[0].key) {
          // 如果在上，同时将图向下移动
          this.root
            .attr('transform', `translate(${padding[3]}, ${legendHeight + maxHeight})`)
          this.move = legendHeight + maxHeight
        } else {
          // 如果在下，就移动标题和单位的高度
          this.root
            .attr('transform', `translate(${padding[3]}, ${maxHeight})`)
          this.move = maxHeight
        }
      }
    }
  }

  // 没有图例 也要移动主图表
  if (!legendVisible) {
    this.root
      .attr('transform', `translate(${padding[3]}, ${maxHeight})`)
  }

  if (zoomInSize) {
    this.mainWidth = this.mainWidth - legendW - zoomInSize - zoomOutSize
    this.translateX = padding[3]
  } else {
    /* 计算容器宽度, 容器宽度为减去左右边距宽度 */
    this.mainWidth -= legendW
  }
  /* X偏移 */
  this.translateX = padding[3]

  /* Y偏移 */
  // eslint-disable-next-line no-constant-condition
  if (!0) {
    if (legendPosition === LEGEND_POSITION[3].key) {
      // 如果图例显示并未位置在标题栏时
      this.translateY = padding[0] + Math.max(maxHeight, legendHeight)
    } else {
      // 如果图例不在标题栏则先加上标题单位的高度
      this.translateY = padding[0] + maxHeight

      // 如果图例显示并且位置在上时 需要加上图例高度
      if (legendPosition === LEGEND_POSITION[0].key) {
        this.translateY += legendHeight
      }
    }
  }

  // 如果是全屏则容器Y轴偏移为0
  // 并且高度仅为减掉填充的高度
  if (fullScreen) {
    this.translateY = padding[0]
    // this.mainHeight = height - padding[0] - padding[2]
  }
}

/**
   * 绘制title
   *
   * @memberof Layout
   */
export function drawTitle(opt) {
  const {
    // artboardHeight,
    titleSize, 
    titleColor, 
    titleText,
    titleY,
  } = opt

  this.svg.append('text')
    .attr('class', 'wave-title')
    .attr('dominant-baseline', 'hanging')
    .attr('font-size', this.fontSize(titleSize))
    .attr('fill', titleColor)
    .text(titleText)
    .textHack()  
    
  // 计算标题的高度
  opt.titleHeight = getTextHeight(this.fontSize(titleSize)) + titleY

  // 解决window系统上单位和title紧挨问题
  if (isWindows()) {
    opt.titleHeight *= 1.25
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
export function drawUnit(svg, x = 0, y = 0, opt) {
  const {
    // artboardHeight,
    unitSize, 
    unitColor, 
    unitContent,
    unitY,
  } = opt

  const text = svg.append('text')
    .attr('class', 'wave-unit')
    .attr('dominant-baseline', 'hanging')
    .attr('font-size', this.fontSize(unitSize))
    .attr('fill', unitColor)
    .attr('x', x)
    .attr('y', y)
    .text(unitContent)
      
  if (text) {
    (text).textHack()
  }
  opt.unitHeight = getTextHeight(this.fontSize(unitSize)) + unitY

  // 解决window系统上单位和title紧挨问题
  if (isWindows()) {
    opt.unitHeight *= 1.25
  }
}

/**
   * 获取住绘图区域的属性
   *
   * @returns
   * @memberof Layout
   */
export function getLayout() {
  const {
    translateX,
    translateY,
    mainWidth,
    mainHeight,
    padding,
  } = this

  return {
    mainWidth,
    mainHeight,
    padding,
    _titleHeight: this.titleHeight,
    _unitHeight: this.unitHeight,
    _translateY: translateY,
    _translateX: translateX,
    root: this.svg.append('g')
      .attr('transform', `translate(${translateX}, ${translateY})`)
      .attr('width', mainWidth).attr('height', mainHeight)
      .attr('class', 'wave-root')
      .append('g'),
  }
}
