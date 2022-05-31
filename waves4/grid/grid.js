import * as d3 from 'd3'

const defaultOption = {
  lineDash: '3 3', // 2px线 + 3px间隙
  lineWidth: 1,
  lineOpacity: 0.2,
  guideLineOpacity: 0.5,
  lineColor: '#fff',
  guideLineColor: '#fff',
  isMarkVisible: true,
  markOpacity: 0.5,
  unit: 40,
}

// 画网格
export default class Grid {
  constructor(option) {
    this.option = {...defaultOption, ...option}
    const {container, width, height, unit} = this.option
    d3.select(container).selectAll('svg').remove()
    this.root = d3.select(container).append('svg').attr('width', width).attr('height', height).append('g')
    this.xUnits = width / unit
    this.yUnits = height / unit
  }

  // 画网格线
  draw() {
    const {root, xUnits, yUnits, option} = this
    const {
      unit,
      width,
      height,
      lineDash,
      lineOpacity,
      lineWidth,
      guideLineOpacity,
      isMarkVisible,
      markOpacity,
      guideLineColor,
      lineColor,
    } = option
    // 是不是偶数单位
    const isEvenX = xUnits % 2 === 0
    const isEvenY = yUnits % 2 === 0
    // 下面的range是d3中range的概念
    let xRangeStart
    let xRangeEnd
    let yRangeStart
    let yRangeEnd
    let xTranslate
    let yTranslate

    if (isEvenX) {
      xRangeStart = -1 * (xUnits / 2)
      xRangeEnd = 1 + xUnits / 2
      xTranslate = width / 2
    } else {
      xRangeStart = -1 * Math.ceil(xUnits / 2) - 1
      xRangeEnd = 1 + Math.ceil(xUnits / 2)
      xTranslate = width / 2 + unit / 2
    }

    if (isEvenY) {
      yRangeStart = -1 * (yUnits / 2)
      yRangeEnd = 1 + yUnits / 2
      yTranslate = height / 2
    } else {
      yRangeStart = -1 * Math.ceil(yUnits / 2) - 1
      yRangeEnd = 1 + Math.ceil(yUnits / 2)
      yTranslate = height / 2 + unit / 2
    }

    // 网格线的父容器，根据奇数偶数，确定左上角的坐标点
    const lines = root
      .append('g')
      .attr('transform', `translate(${xTranslate}, ${yTranslate})`)
      .attr('class', 'wave-grid-lines')

    // 垂直的线
    lines
      .selectAll('line.wave-grid-v-line')
      .data(d3.range(xRangeStart, xRangeEnd)) // [0, n-1] 横向格子数量
      .join('line')
      .attr('class', (d) => `wave-grid-v-line wave-grid-v-line${d}`)
      .attr('x1', (d) => d * unit)
      .attr('y1', -1 * (height / 2) - (isEvenY ? 0 : unit / 2))
      .attr('x2', (d) => d * unit)
      .attr('y2', height / 2)
      .attr('stroke', (d) => {
        return (d + (isEvenX || d >= 0 ? 0 : 1)) % 5 === 0 ? guideLineColor : lineColor
      })
      .attr('stroke-width', lineWidth)
      .attr('stroke-dasharray', lineDash)
      .attr('opacity', (d) => {
        return (d + (isEvenX || d >= 0 ? 0 : 1)) % 5 === 0 ? guideLineOpacity : lineOpacity
      })

    // 水平的线
    lines
      .selectAll('line.wave-grid-h-line')
      .data(d3.range(yRangeStart, yRangeEnd)) // [0, n-1] 纵向28个格子需要29根线
      .join('line')
      .attr('class', (d) => `wave-grid-h-line wave-grid-h-line${d}`)
      .attr('x1', -1 * (width / 2) - (isEvenX ? 0 : unit / 2))
      .attr('y1', (d) => d * unit)
      .attr('x2', width / 2)
      .attr('y2', (d) => d * unit)
      .attr('stroke', (d) => {
        return (d + (isEvenY || d >= 0 ? 0 : 1)) % 5 === 0 ? guideLineColor : lineColor
      })
      .attr('stroke-width', lineWidth)
      .attr('stroke-dasharray', lineDash)
      .attr('opacity', (d) => {
        return (d + (isEvenY || d >= 0 ? 0 : 1)) % 5 === 0 ? guideLineOpacity : lineOpacity
      })

    if (isMarkVisible) {
      const offset = 2
      const fontSize = 8
      const marks = this.root.append('g').attr('class', 'wave-grid-marks')
      const appendStyle = (text) =>
        text
          .attr('fill', '#fff')
          .attr('font-size', fontSize)
          .attr('font-family', 'Helvetica Neue')
          .attr('alignment-baseline', 'before-edge')
          .attr('opacity', markOpacity)
          .text((d) => d)

      // 上边缘水平方向的刻度
      const horizontalMarks = marks
        .selectAll('.wave-grid-h-mark')
        .data(d3.range(1, this.xUnits + 1))
        .join('text')
        .attr('class', 'wave-grid-h-mark')
        .attr('x', (d) => d * unit + -offset)
        .attr('y', 0)
        .attr('text-anchor', 'end')
      appendStyle(horizontalMarks)

      // 左边缘垂直方向的刻度
      const verticalMark = marks
        .selectAll('.wave-grid-v-mark')
        .data(d3.range(1, this.yUnits + 1))
        .join('text')
        .attr('class', 'wave-grid-v-mark')
        .attr('x', 0)
        .attr('y', (d) => d * unit - offset - fontSize)
      appendStyle(verticalMark)
    }
  }
}
