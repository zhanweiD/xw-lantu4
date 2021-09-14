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
  ['scatterLayer', 'scatter'],
  ['pointLayer', 'line'],
])

// 工具 schema 到图表 schema 的转换
export const mapOption = (options, mapping) => {
  const result = {
    options: {},
    scale: {},
    style: {},
  }
  new Map(mapping).forEach((targetKey, sourceKey) => {
    const source = sourceKey.split('.')
    const target = targetKey.split('.')
    // 取值
    let value = options
    for (let i = 0; i < source.length; i++) {
      if (!value) {
        break
      } else {
        value = value[source[i]]
      }
    }
    // 设置值
    let current = result
    for (let i = 0; i < target.length; i++) {
      if (i !== target.length - 1 && !current[target[i]]) {
        current[target[i]] = {}
      } else if (i === target.length - 1) {
        current[target[i]] = value
      }
      current = current[target[i]]
    }
  })
  return result
}

export const mapLayerOption = (options, layerType) => {
  switch (layerType) {
    case 'line':
      return mapOption(options, [
        // 点
        ['point.fill.colorSingle', 'style.circle.fill'],
        ['point.fill.opacity', 'style.circle.fillOpacity'],
        ['point.stroke.colorSingle', 'style.circle.stroke'],
        ['point.stroke.lineWidth', 'style.circle.strokeWidth'],
        // 线
        ['line.colorSingle', 'style.curve.stroke'],
        ['line.lineWidth', 'style.curve.strokeWidth'],
        ['line.opacity', 'style.curve.strokeOpacity'],
        // 标签-文本
        ['label.text.textSize', 'style.text.fontSize'],
        ['label.text.textWeight', 'style.text.fontWeight'],
        ['label.text.opacity', 'style.text.fillOpacity'],
        ['label.text.colorSingle', 'style.text.fill'],
        // 标签-阴影
        ['label.shadow.colorSingle', 'style.text.shadow.color'],
        ['label.shadow.blur', 'style.text.shadow.blur'],
        ['label.shadow.offset', 'style.text.shadow.offset'],
        ['label.shadow.opacity', 'style.text.shadow.opacity'],
        // 标签-格式
        ['label.format.thousandDiv', 'style.text.format.thousandth'],
      ])
    default:
      return null
  }
}
