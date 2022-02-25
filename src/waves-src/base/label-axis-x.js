const STATIC = {
  DIRECTION: [{
    key: 'HIRONZATAL',
    value: '横排',
  }, {
    key: 'VERTICAL',
    value: '竖排',
  }],
}

const defaultOption = {
  xTickSize: 12,
  xTickColor: 'RGBA(255, 255, 255, 0.65)',
  xTickDirection: STATIC.DIRECTION[0].key,
  xTickAngle: 0,
  xTickOffset: 0,
  xTickLineOpacity: 0.2,
}

// 生成x轴
export function drawAxisX(axisXOption) {
  const option = {...defaultOption, ...axisXOption, ...this._option}
  const {
    scale,
    xTickLineOpacity,
    xTickSize,
    xTickColor,
    xTickAngle,
    xTickOffset,
    xTickDirection,
  } = option

  let labels
  const lineHeight = 6

  // 间隔显示，过滤 label
  const axisLabelInterval = this.config('axisLabelInterval')
  if (axisLabelInterval) {
    let count = 0
    labels = scale.domain().reduce((previous, current) => {
      if (count === 0) {
        count = axisLabelInterval
        return [...previous, current]
      }
      count--
      return previous
    }, [])
  } else {
    labels = scale.domain()
  }
  
  // 记录文本的Y
  let textY = 0

  // 绘制之前先看之前是否绘制过X轴 如果绘制过需要先删除再重绘
  const textAnchor = (() => {
    let anchor = 'middle'
    if (xTickDirection === STATIC.DIRECTION[1].key) {
      anchor = 'start'
    } else {
      if (xTickAngle > 0) anchor = 'start'
      if (xTickAngle === 0) anchor = 'middle'
      if (xTickAngle < 0)anchor = 'end'
    }
    return anchor
  })()
  this.container.select('.wave-axis-x').remove()
  const axisXContainer = (this.isDev ? this.root.append('g') : this.container.select('svg').append('g'))
    .attr('class', 'wave-axis-x')
    .attr('transform', `translate(${this.isDev ? 0 : this.translateX}, ${this.mainHeight + xTickOffset + (this.isDev ? 0 : this.translateY)})`)
    .attr('text-anchor', textAnchor)
    .attr('fill', 'none')

  axisXContainer.append('path')
    .attr('stroke', 'transparent')
    .attr('d', `M${scale.range()[0]},6V0.5H${scale.range()[1]}V6`)

  const xKeys = axisXContainer.selectAll('g')
    .data(labels)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${scale(d)}, 0)`)

  xKeys.append('line')
    .attr('stroke', '#fff')
    .attr('stroke-opacity', xTickLineOpacity)
    .attr('y1', 0 - xTickOffset)
    .attr('y2', lineHeight - xTickOffset)

  // X轴文本排列方向
  const xTickSizeF = this.fontSize(xTickSize)
  const writingMode = xTickDirection === STATIC.DIRECTION[1].key ? 'vertical-rl' : 'horizontal-tb'

  textY += lineHeight
  xKeys.append('text')
    .attr('class', (d, i) => `wave-axis-x-item wave-axis-x-${i}`)
    .attr('fill', xTickColor)
    .attr('font-size', xTickSizeF)
    .text(d => (this._isWarn ? '' : d))
    .attr('dominant-baseline', 'central')
    .attr('transform', () => `translate(0,${textY + (
      xTickDirection === STATIC.DIRECTION[1].key ? 0 : xTickSize / 2
    )})rotate(${xTickAngle})`)
    .attr('writing-mode', writingMode)
}

export const AXISX_STATIC = STATIC
