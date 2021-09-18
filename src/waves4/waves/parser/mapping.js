// 工具对齐字段到图表对齐字段的映射
export const mapAlign = (align) => {
  switch (align) {
    case 'topLeft':
      return ['start', 'start']
    case 'topCenter':
      return ['middle', 'start']
    case 'topRight':
      return ['end', 'start']
    case 'middleLeft':
      return ['start', 'middle']
    case 'middleCenter':
      return ['middle', 'middle']
    case 'middleRight':
      return ['end', 'middle']
    case 'bottomLeft':
      return ['start', 'end']
    case 'bottomCenter':
      return ['middle', 'end']
    case 'bottomRight':
      return ['end', 'end']
    default:
      return [null, null]
  }
}

// 多色二维数组到一维数组的转换
export const mapColor = (fillColor) => {
  if (isArray(fillColor)) {
    const result = []
    fillColor.reduce(([prevColor, prevOffset], [curColor, curOffset]) => {
      const number = Number((curOffset - prevOffset) / 0.01).toFixed(2)
      const colors = chroma.scale([prevColor, curColor]).mode('lch').colors(number)
      result.push(...colors)
      return [curColor, curOffset]
    })
    return result
  }
  return fillColor
}

export const layerTypeMap = new Map([
  ['axis', 'axis'],
  ['title', 'text'],
  ['legend', 'legend'],
  ['line', 'line'],
])

export const layerOptionMap = new Map([
  [
    'title',
    {
      // 内容
      'base.content': 'data',
      // 文本
      'text.offset': 'style.offset',
      'text.colorSingle': 'style.text.fill',
      'text.opacity': 'style.text.fillOpacity',
      'text.textSize': 'style.text.fontSize',
      'text.textWeight': 'style.text.fontWeight',
      // 阴影
      'shadow.colorSingle': 'style.text.shadow.color',
      'shadow.offset': 'style.text.shadow.offset',
    },
  ],
  [
    'legend',
    {
      'legend.base.size': 'style.shapeSize',
      'legend.base.offset': 'style.offset',
    },
  ],
  [
    'axis',
    {
      // x轴
      'xAxis.label.text.textSize': 'style.textX.fontSize',
      'xAxisLine.colorSinle': 'style.lineAxisX.stroke',
      'xAxisSplitLine.colorSingle': 'style.lineTickX.stroke',
      'xAxisSplitLine.opacity': 'style.lineTickX.opacity',
      // y轴
      'yAxisLine.colorSinle': 'style.lineAxisY.stroke',
      'yAxisSplitLine.colorSingle': 'style.lineTickY.stroke',
      'yAxisSplitLine.opacity': 'style.lineTickY.opacity',
    },
  ],
  [
    'line',
    {
      // 点
      'point.size': 'style.circleSize',
      // 线
      'line.lineWidth': 'style.curve.strokeWidth',
      // 标签
      'label.text.textSize': 'style.text.fontSize',
      'label.effective': 'style.text.hide',
      'label.shadow.effective': 'style.text.shadow.disable',
    },
  ],
])
