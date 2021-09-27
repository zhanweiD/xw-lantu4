import chroma from 'chroma-js'

// 工具对齐字段到图表对齐字段的映射
export const positionMap = new Map([
  [
    'align',
    {
      topLeft: 'start',
      topCenter: 'middle',
      topRight: 'end',
      middleLeft: 'start',
      middleCenter: 'middle',
      middleRight: 'end',
      bottomLeft: 'start',
      bottomCenter: 'middle',
      bottomRight: 'end',
    },
  ],
  [
    'verticalAlign',
    {
      topLeft: 'start',
      topCenter: 'start',
      topRight: 'start',
      middleLeft: 'middle',
      middleCenter: 'middle',
      middleRight: 'middle',
      bottomLeft: 'end',
      bottomCenter: 'end',
      bottomRight: 'end',
    },
  ],
])

// 多色二维数组到一维数组的转换
export const mapColor = (fillColor) => {
  if (Array.isArray(fillColor)) {
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

export const layerTypeMap = new Map([['title', 'text']])

export const layerOptionMap = new Map([
  [
    'text',
    ({mapOption, getOption}) => {
      const mapping = [
        // 内容
        ['base.content', 'data'],
        ['base.layoutPosition', 'style.align', positionMap.get('align')],
        ['base.layoutPosition', 'style.verticalAlign', positionMap.get('verticalAlign')],
        ['base.offset', 'style.text.offset'],
        // 文本
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
        ['text.opacity', 'style.text.fillOpacity'],
        // 阴影
        ['shadow.offset', 'style.text.shadow.offset'],
        ['shadow.blur', 'style.text.shadow.blur'],
        ['shadow.singleColor', 'style.text.shadow.color'],
      ]
      const storage = mapOption(mapping)
      if (getOption('effective') !== undefined) {
        storage.set('style.text.hide', !getOption('effective'))
      }
      if (getOption('shadow.effective') !== undefined) {
        storage.set('style.text.shadow.hide', !getOption('shadow.effective'))
      }
      return storage.get()
    },
  ],
  [
    'axis',
    ({mapOption, getOption}) => {
      const mapping = [
        // 比例尺
        ['base.tickCount', 'scale.count'],
        ['base.tickZero', 'scale.zero'],
        ['base.paddingInner', 'scale.paddingInner'],
        // x文本
        ['xAxis.label.offset', 'style.textX.offset'],
        ['xAxis.label.text.textSize', 'style.textX.fontSize'],
        ['xAxis.label.text.textWeight', 'style.textX.fontWeight'],
        ['xAxis.label.text.singleColor', 'style.textX.fill'],
        ['xAxis.label.text.opacity', 'style.textX.fillOpacity'],
        // x文本阴影
        ['xAxis.label.shadow.offset', 'style.textX.shadow.offset'],
        ['xAxis.label.shadow.blur', 'style.textX.shadow.blur'],
        ['xAxis.label.shadow.singleColor', 'style.textX.shadow.color'],
        // x轴线
        ['xAxis.xAxisLine.lineWidth', 'style.lineAxisX.strokeWidth'],
        ['xAxis.xAxisLine.singleColor', 'style.lineAxisX.stroke'],
        ['xAxis.xAxisLine.opacity', 'style.lineAxisX.strokeOpacity'],
        // x刻度线
        ['xAxis.xAxisSplitLine.lineWidth', 'style.lineTickX.strokeWidth'],
        ['xAxis.xAxisSplitLine.singleColor', 'style.lineTickX.stroke'],
        ['xAxis.xAxisSplitLine.opacity', 'style.lineTickX.strokeOpacity'],
        // y文本
        ['yAxis.label.offset', 'style.textY.offset'],
        ['yAxis.label.thousandDiv', 'style.textY.format.thousandth'],
        ['yAxis.label.percentage', 'style.textY.format.percentage'],
        ['yAxis.label.text.textSize', 'style.textY.fontSize'],
        ['yAxis.label.text.textWeight', 'style.textY.fontWeight'],
        ['yAxis.label.text.singleColor', 'style.textY.fill'],
        ['yAxis.label.text.opacity', 'style.textY.fillOpacity'],
        // y文本阴影
        ['yAxis.label.shadow.offset', 'style.textY.shadow.offset'],
        ['yAxis.label.shadow.blur', 'style.textY.shadow.blur'],
        ['yAxis.label.shadow.singleColor', 'style.textY.shadow.color'],
        // y轴线
        ['yAxis.yAxisLine.lineWidth', 'style.lineAxisY.strokeWidth'],
        ['yAxis.yAxisLine.singleColor', 'style.lineAxisY.stroke'],
        ['yAxis.yAxisLine.opacity', 'style.lineAxisY.strokeOpacity'],
        // y刻度线
        ['yAxis.yAxisSplitLine.lineWidth', 'style.lineTickY.strokeWidth'],
        ['yAxis.yAxisSplitLine.singleColor', 'style.lineTickY.stroke'],
        ['yAxis.yAxisSplitLine.opacity', 'style.lineTickY.strokeOpacity'],
      ]
      const storage = mapOption(mapping)
      // x显隐
      if (getOption('xAxis.label.effective') !== undefined) {
        storage.set('style.textX.hide', !getOption('xAxis.label.effective'))
      }
      if (getOption('xAxis.label.shadow.effective') !== undefined) {
        storage.set('style.textX.shadow.hide', !getOption('xAxis.label.shadow.effective'))
      }
      if (getOption('xAxis.xAxisLine.effective') !== undefined) {
        storage.set('style.lineAxisX.hide', !getOption('xAxis.xAxisLine.effective'))
      }
      if (getOption('xAxis.xAxisSplitLine.effective') !== undefined) {
        storage.set('style.lineTickX.hide', !getOption('xAxis.xAxisSplitLine.effective'))
      }
      // y显隐
      if (getOption('yAxis.label.effective') !== undefined) {
        storage.set('style.textY.hide', !getOption('yAxis.label.effective'))
      }
      if (getOption('yAxis.label.shadow.effective') !== undefined) {
        storage.set('style.textY.shadow.hide', !getOption('yAxis.label.shadow.effective'))
      }
      if (getOption('yAxis.yAxisLine.effective') !== undefined) {
        storage.set('style.lineAxisY.hide', !getOption('yAxis.yAxisLine.effective'))
      }
      if (getOption('yAxis.yAxisSplitLine.effective') !== undefined) {
        storage.set('style.lineTickY.hide', !getOption('yAxis.yAxisSplitLine.effective'))
      }
      return storage.get()
    },
  ],
  [
    'legend',
    ({mapOption, getOption}) => {
      const mapping = [
        // 基础
        ['base.direction', 'style.direction'],
        ['base.layoutPosition', 'style.align', positionMap.get('align')],
        ['base.layoutPosition', 'style.verticalAlign', positionMap.get('verticalAlign')],
        ['base.offset', 'style.offset'],
        ['base.gap', 'style.gap'],
        // 形状
        ['shape.size', 'style.shapeSize'],
        ['shape.opacity', 'style.shape.fillOpacity'],
        ['shape.opacity', 'style.shape.strokeOpacity'],
        // 文本
        ['label.text.textSize', 'style.text.fontSize'],
        ['label.text.textWeight', 'style.text.fontWeight'],
        ['label.text.singleColor', 'style.text.fill'],
        ['label.text.opacity', 'style.text.fillOpacity'],
        // 阴影
        ['label.shadow.offset', 'style.text.shadow.offset'],
        ['label.shadow.blur', 'style.text.shadow.blur'],
        ['label.shadow.singleColor', 'style.text.shadow.color'],
      ]
      const storage = mapOption(mapping)
      if (getOption('effective') !== undefined) {
        storage.set('style.text.hide', !getOption('effective'))
        storage.set('style.shape.hide', !getOption('effective'))
      }
      if (getOption('label.shadow.effective') !== undefined) {
        storage.set('style.text.shadow.hide', !getOption('label.shadow.effective'))
      }
      return storage.get()
    },
  ],
  [
    'line',
    ({mapOption, getOption}) => {
      const mapping = [
        // 点
        ['point.size', 'style.pointSize'],
        ['point.singleColor', 'style.point.fill'],
        ['point.opacity', 'style.point.fillOpacity'],
        // 线
        ['line.lineWidth', 'style.curve.strokeWidth'],
        ['line.lineCurve', 'style.curve.curve'],
        ['line.lineFallback', 'options.fallback'],
        ['line.axisBinding', 'options.axis'],
        // 面
        ['area.opacity', 'style.area.fillOpacity'],
        // 标签
        ['label.offset', 'style.text.offset'],
        ['label.relativePosition', 'style.labelPosition'],
        ['label.decimalPlaces', 'style.text.format.decimalPlace'],
        ['label.thousandDiv', 'style.text.format.thousandth'],
        ['label.percentage', 'style.text.format.percentage'],
        ['label.text.textSize', 'style.text.fontSize'],
        ['label.text.textWeight', 'style.text.fontWeight'],
        ['label.text.singleColor', 'style.text.fill'],
        ['label.text.opacity', 'style.text.fillOpacity'],
        // 标签阴影
        ['label.shadow.offset', 'style.text.shadow.offset'],
        ['label.shadow.blur', 'style.text.shadow.blur'],
        ['label.shadow.singleColor', 'style.text.shadow.color'],
      ]
      const storage = mapOption(mapping)
      if (getOption('area.effective') !== undefined) {
        storage.set('style.area.hide', !getOption('area.effective'))
      }
      if (getOption('label.effective') !== undefined) {
        storage.set('style.text.hide', !getOption('label.effective'))
      }
      if (getOption('label.shadow.effective') !== undefined) {
        storage.set('style.text.shadow.hide', !getOption('label.shadow.effective'))
      }
      return storage.get()
    },
  ],
  [
    'rect',
    ({mapOption, getOption}) => {
      const mapping = [
        ['rect.axisBinding', 'options.axis'],
        // 背景
        ['background.singleColor', 'style.background.fill'],
        ['background.opacity', 'style.background.fillOpacity'],
        // 标签
        ['label.offset', 'style.text.offset'],
        ['label.relativePosition', 'style.labelPosition'],
        ['label.decimalPlaces', 'style.text.format.decimalPlace'],
        ['label.thousandDiv', 'style.text.format.thousandth'],
        ['label.percentage', 'style.text.format.percentage'],
        ['label.text.textSize', 'style.text.fontSize'],
        ['label.text.textWeight', 'style.text.fontWeight'],
        ['label.text.singleColor', 'style.text.fill'],
        ['label.text.opacity', 'style.text.fillOpacity'],
        // 标签阴影
        ['label.shadow.offset', 'style.text.shadow.offset'],
        ['label.shadow.blur', 'style.text.shadow.blur'],
        ['label.shadow.singleColor', 'style.text.shadow.color'],
      ]
      const storage = mapOption(mapping)
      if (getOption('background.effective') !== undefined) {
        storage.set('style.background.hide', !getOption('background.effective'))
      }
      if (getOption('label.effective') !== undefined) {
        storage.set('style.text.hide', !getOption('label.effective'))
      }
      if (getOption('label.shadow.effective') !== undefined) {
        storage.set('style.text.shadow.hide', !getOption('label.shadow.effective'))
      }
      return storage.get()
    },
  ],
])
