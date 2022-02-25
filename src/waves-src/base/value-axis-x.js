import * as d3 from 'd3'

const defaultOption = {
  valueAxisXSize: 12,
  valueAxisXColor: 'RGBA(255, 255, 255, 0.65)',
  valueAxisXOpacity: 0.2,
  valueAxisXTickCount: 8,
  xTickOffset: 0,
  lineVisible: true,
}

// 生成x轴
export default function drawValueAxisX(axisXOption) {
  const option = {...defaultOption, ...axisXOption, ...this._option}
  const {
    root,
    scale, 
    valueAxisXSize,
    valueAxisXColor,
    valueAxisXOpacity,
    valueAxisXTickCount,
    valueAxisXWidth,
    valueAxisXValue,
    xTickOffset,
    lineVisible,
  } = option

  // 容器 默认在 root上
  const container = (this.isDev ? this.root : root) || this.container.select('svg')
  // 最大宽度 默认图标宽度
  const width = valueAxisXWidth || this.mainWidth
  // 数值
  const value = valueAxisXValue || 0
  // 比例尺
  const scaleX = scale || d3.scaleLinear().range([0, width]).domain([0, value * 1.1]) 

  // 如果该图表之前绘制过x轴 那么现在需要对比之前的轴 如果一样那么不需要重绘
  this.__cache__ = this.__cache__ || {}
  // const oldScale = this.__cache__.valueAxisX || [null, null]
  // TODO: 时三改的，不改这里warn状态下scaleX.domain（）不改变不会导致scaleX重绘，
  // 从warn下恢复相同的尺度不会导致scale重绘，因为从warn状态下隐藏数字目前采用的是在this.formatMoney中判断this._isWarn的值，被折磨了
  // if (JSON.stringify(scaleX.domain()) === JSON.stringify(oldScale)) {
  //   return scaleX
  // }
  container.select('.wave-axis-x').remove()
  this.__cache__.valueAxisX = scaleX.domain()

  // 绘制X轴
  const customXaxis = g => {
    // TODO: 时三改的,统一为添加formatMoney处理，如果当前组件content中this._isWarn为true则this.formatMoney返回'',即空字符串隐藏刻度
    const currentFormatMoney = d => {
      return this._isWarn ? '' : this.formatMoney(d)
    }
    g.call(d3.axisBottom(scaleX).ticks(valueAxisXTickCount).tickFormat(currentFormatMoney).tickPadding(6))
    g.select('.domain').remove()
    g.selectAll('.tick text')
      .attr('class', 'wave-xaxis')
      .attr('font-size', this.fontSize(valueAxisXSize))
      .attr('fill', valueAxisXColor)
    g.selectAll('.tick line')
      .attr('opacity', valueAxisXOpacity)
  }

  // X轴容器
  const axisx = container.append('g')
    .attr('class', 'wave-axis-x')
    .attr('transform', `translate(${this.isDev ? 0 : this.translateX}, ${this.mainHeight + xTickOffset + (this.isDev ? 0 : this.translateY)})`)

  axisx.call(customXaxis)

  // 分隔线
  if (lineVisible) {
    axisx.append('g').append('line')
      .attr('x1', 0)
      .attr('x2', this.mainWidth)
      .attr('stroke', `rgba(255,255,255, ${valueAxisXOpacity})`)
  }

  // 绘制参考线
  this.drawReferenceLine({scaleX})

  return scaleX
}
