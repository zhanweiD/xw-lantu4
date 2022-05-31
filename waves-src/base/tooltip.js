// 仅测试使用，真正的悬浮框请参照其他组件内部使用

export function drawTooltip(position, tooltipOption) {
  // if (!this.config('tooltipVisible')) return
  if (this.tooltip) {
    this.tooltip.html('')
  }
  const arr = Object.keys(tooltipOption)
  const tooltipSize = this.config('tooltipSize') || 24
  const height = this.getTextHeight(tooltipSize)
  // eslint-disable-next-line no-unused-vars
  let length = 0
  let longArr = ''
  let width = this.getTextWidth(longArr, this.fontSize(tooltipSize))
  // 得到要展示的字段的最长长度和内容
  arr.forEach((item) => {
    if (this.getTextWidth(`${item}:${tooltipOption[item]}`, this.fontSize(tooltipSize)) > width) {
      length = `${item}:${tooltipOption[item]}`.length
      longArr = `${item}:${tooltipOption[item]}`
      width = this.getTextWidth(`${item}:${tooltipOption[item]}`, this.fontSize(tooltipSize))
    }
  })
  // 判断坐标是否超出了容器，如果超出则做上移和左移处理
  if (position[0] + width * (1 / 2) + this.mainWidth / 30 > this.mainWidth) {
    position[0] -= position[0] + width + this.mainWidth / 30 - this.mainWidth
  }
  if (position[1] + height + this.mainHeight / 30 > this.mainHeight) {
    position[1] -= position[1] + this.mainHeight / 30 + height * 2 - this.mainHeight
  }
  // 存放容器
  if (!this.tooltip) {
    this.tooltip = this.svg.selectAll('.tooltip').data([tooltipOption]).enter().append('g').attr('class', 'tooltip')
  }

  // 外层容器
  this.tooltip
    .selectAll('.tooltipBox')
    .data([tooltipOption])
    .enter()
    .append('rect')
    .attr('transform', () => `translate(${position[0] + this.mainWidth / 30}, ${position[1] + this.mainHeight / 30})`)
    .attr('class', 'tooltipBox')
    .attr('width', width * (3 / 2))
    .attr('height', height * (arr.length + 1))
    .attr('fill', '#0f2888b0')

  arr.forEach((item, index) => {
    this.tooltip
      .selectAll(`.tooltipLabel${index}`)
      .data([tooltipOption])
      .enter()
      .append('text')
      .attr('class', 'tooltipTitle')
      .attr(
        'transform',
        () =>
          `translate(${position[0] + width / 4 + this.mainWidth / 30}, ${
            position[1] + height * (index + 1) + 5 * index + this.mainHeight / 30
          })`
      )
      .attr('fill', 'white')
      .attr('font-size', this.fontSize(tooltipSize))
      .text((d) => `${item}: ${d[item]}`)
  })
}

export function destoryTooltip() {
  // if (!this.config('tooltipVisible')) return
  this.tooltip?.html('')
}
