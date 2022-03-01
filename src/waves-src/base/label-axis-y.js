import * as d3 from 'd3'

const defaultOption = {
  labelYTickSize: 12,
  labelYTickColor: 'RGBA(255, 255, 255, 0.65)',
  offsetY: 0,
}

// 绘制Y标签轴
export default function drawLabelAxisY(axisYOption) {
  const option = {...defaultOption, ...axisYOption, ...this._option}
  const {scale, root, domain, labelYTickSize, labelYTickColor, labelAxisYHeight, offsetY = 0} = option

  // 将柱子的高度注入，使根据labelY定位的带有柱子的图也保持图的一致
  const {barWidth = 0} = axisYOption
  const {translateY} = this
  // y轴上下偏移 默认跟随图表主体的偏移
  const y = typeof translateY === 'number' ? translateY : this._translateY
  // 容器 默认在 svg上
  const container = (this.isDev ? this.root : root) || this.container.select('svg')
  // 图表高度 默认this.mainHeight
  const height = labelAxisYHeight || this.mainHeight
  // 如果未传scale默认创建一个比例尺
  const scaleY =
    scale ||
    d3
      .scalePoint()
      .range([0 + barWidth, Math.round(height) - barWidth])
      .domain(domain)
      .padding(0)
  // 标签数据
  const label = domain || scaleY.domain()

  // 和之前的labels比较 如果labels一点都没变那么X轴不会重绘
  this.__cache__ = this.__cache__ || {}
  const oldLabels = this.__cache__.axisYlabel
  let redraw = false
  if (!oldLabels || oldLabels.length !== label.length) {
    redraw = true
  } else {
    for (let i = 0, l = oldLabels.length; i < l; i += 1) {
      if (oldLabels[i] !== label[i]) {
        // eslint-disable-next-line no-unused-vars
        redraw = true
      }
    }
  }
  // if (!this._isWarn) {
  //   if (!redraw) {
  //     return scaleY
  //   }
  // }

  // 绘制之前先看之前是否绘制过Y轴 如果绘制过需要先删除再重绘
  container.select('.wave-axis-y').remove()
  this.__cache__.axisYlabel = label

  // 绘制Y轴
  container
    .append('g')
    .attr('transform', `translate(${this.isDev ? -this.padding[3] : offsetY}, ${this.isDev ? 0 : y})`)
    .attr('class', 'wave-axis-y')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', this.fontSize(labelYTickSize))
    .attr('fill', labelYTickColor)
    .selectAll('text')
    .data(label)
    .enter()
    .append('text')
    .text((d) => (this._isWarn ? '' : d))
    .attr('y', (d) => scaleY(d))
    .attr('dy', '0.1em')

  return scaleY
}
