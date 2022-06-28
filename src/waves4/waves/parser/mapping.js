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
        ['xAxis.label.thousandDiv', 'style.textX.format.thousandth'],
        ['xAxis.label.percentage', 'style.textX.format.percentage'],
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
        ['xAxis.xAxisLine.dasharray', 'style.lineTickX.dasharray'],
        // x刻度线
        ['xAxis.xAxisSplitLine.lineWidth', 'style.lineTickX.strokeWidth'],
        ['xAxis.xAxisSplitLine.singleColor', 'style.lineTickX.stroke'],
        ['xAxis.xAxisSplitLine.opacity', 'style.lineTickX.strokeOpacity'],
        ['xAxis.xAxisSplitLine.dasharray', 'style.lineTickX.dasharray'],
        // y文本
        ['yAxis.label.offset', 'style.textY.offset'],
        ['yAxis.label.thousandDiv', 'style.textY.format.thousandth'],
        ['yAxis.label.percentage', 'style.textY.format.percentage'],
        ['yAxis.label.text.textSize', 'style.textY.fontSize'],
        ['yAxis.label.text.textWeight', 'style.textY.fontWeight'],
        ['yAxis.label.text.singleColor', 'style.textY.fill'],
        ['yAxis.label.text.opacity', 'style.textY.fillOpacity'],
        // y副轴文本
        ['yAxis.label.offset', 'style.textYR.offset'],
        ['yAxis.label.thousandDiv', 'style.textYR.format.thousandth'],
        ['yAxis.label.percentage', 'style.textYR.format.percentage'],
        ['yAxis.label.text.textSize', 'style.textYR.fontSize'],
        ['yAxis.label.text.textWeight', 'style.textYR.fontWeight'],
        ['yAxis.label.text.singleColor', 'style.textYR.fill'],
        ['yAxis.label.text.opacity', 'style.textYR.fillOpacity'],
        // y文本阴影
        ['yAxis.label.shadow.offset', 'style.textY.shadow.offset'],
        ['yAxis.label.shadow.blur', 'style.textY.shadow.blur'],
        ['yAxis.label.shadow.singleColor', 'style.textY.shadow.color'],
        // y副轴文本阴影
        ['yAxis.label.shadow.offset', 'style.textYR.shadow.offset'],
        ['yAxis.label.shadow.blur', 'style.textYR.shadow.blur'],
        ['yAxis.label.shadow.singleColor', 'style.textYR.shadow.color'],
        // y轴线
        ['yAxis.axisLine.lineWidth', 'style.lineAxisY.strokeWidth'],
        ['yAxis.axisLine.singleColor', 'style.lineAxisY.stroke'],
        ['yAxis.axisLine.opacity', 'style.lineAxisY.strokeOpacity'],
        ['yAxis.axisLine.dasharray', 'style.lineAxisY.dasharray'],
        // y刻度线
        ['yAxis.axisSplitLine.lineWidth', 'style.lineTickY.strokeWidth'],
        ['yAxis.axisSplitLine.singleColor', 'style.lineTickY.stroke'],
        ['yAxis.axisSplitLine.opacity', 'style.lineTickY.strokeOpacity'],
        ['yAxis.axisSplitLine.dasharray', 'style.lineTickY.dasharray'],
      ]
      const storage = mapOption(mapping)

      // if (getOption('yAxis.axisSplitLine.dasharrayLength')){
      //   const Length = getOption('yAxis.axisSplitLine.dasharrayLength').toString()
      //   const Spacing = getOption('yAxis.axisSplitLine.dasharraySpacing').toString()
      //   storage.set('style.lineTickY.dasharray', `${Length} ${Spacing}`)
      // }
      // if (getOption('yAxis.axisLine.dasharrayLength')){
      //   const Length = getOption('yAxis.axisLine.dasharrayLength').toString()
      //   const Spacing = getOption('yAxis.axisLine.dasharraySpacing').toString()
      //   storage.set('style.lineAxisY.dasharray', `${Length} ${Spacing}`)
      // }

      // if (getOption('xAxis.xAxisSplitLine.dasharrayLength')){
      //   const Length = getOption('xAxis.xAxisSplitLine.dasharrayLength').toString()
      //   const Spacing = getOption('xAxis.xAxisSplitLine.dasharraySpacing').toString()
      //   storage.set('style.lineTickX.dasharray', `${Length} ${Spacing}`)
      // }

      // if (getOption('xAxis.xAxisLine.dasharrayLength')){
      //   const Length = getOption('xAxis.xAxisLine.dasharrayLength').toString()
      //   const Spacing = getOption('xAxis.xAxisLine.dasharraySpacing').toString()
      //   storage.set('style.lineAxisX.dasharray', `${Length} ${Spacing}`)
      // }
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
        storage.set('style.textYR.hide', !getOption('yAxis.label.effective'))
      }
      if (getOption('yAxis.label.shadow.effective') !== undefined) {
        storage.set('style.textY.shadow.hide', !getOption('yAxis.label.shadow.effective'))
        storage.set('style.textYR.shadow.hide', !getOption('yAxis.label.shadow.effective'))
      }
      if (getOption('yAxis.axisLine.effective') !== undefined) {
        storage.set('style.lineAxisY.hide', !getOption('yAxis.axisLine.effective'))
      }
      if (getOption('yAxis.axisSplitLine.effective') !== undefined) {
        storage.set('style.lineTickY.hide', !getOption('yAxis.axisSplitLine.effective'))
      }

      // x禁用格式化
      if (!storage.get('style.textX.format.thousandth') && !storage.get('style.textX.format.percentage')) {
        storage.set('style.textX.format', false)
      }
      // y禁用格式化
      if (!storage.get('style.textY.format.thousandth') && !storage.get('style.textY.format.percentage')) {
        storage.set('style.textY.format', false)
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
        ['base.gap2', 'style.gap'],
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
        // 基础
        ['base.axisBinding', 'options.axis'],
        // ['base.mode', 'options.mode'],
        // 点
        ['point.size', 'style.pointSize'],
        ['point.singleColor', 'style.point.fill'],
        ['point.opacity', 'style.point.fillOpacity'],
        // 线
        ['line.lineWidth', 'style.curve.strokeWidth'],
        ['line.lineCurve', 'style.curve.curve'],
        ['line.lineFallback', 'options.fallback'],
        ['line.color.colorList', 'style.colorList'],
        // ['line.color.colorType', 'style.curve.colorType'],
        // ['line.color.singleColor', 'style.curve.stroke'],
        // ['line.color.gradientColor', 'style.curve.gradientColor'],
        // ['line.color.rangeColors', 'style.rangeColorList'],
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
        // tooltip
        ['tooltip.show', 'options.tooltipOption.visible'],
        ['unit.show', 'style.unit.showUnit'],
        ['unit.textSize', 'style.unit.fontSize'],
        ['unit.singleColor', 'style.unit.fill'],
        ['unit.offset', 'style.unit.offset'],
        ['unit.content', 'style.unit.data'],
        // 动画
        ['animation.enterAnimation.animationType', 'animation.curve.enter.type'],
        ['animation.enterAnimation.duration', 'animation.curve.enter.duration'],
        ['animation.enterAnimation.delay', 'animation.curve.enter.delay'],
        ['animation.enterAnimation.animationType', 'animation.text.enter.type'],
        ['animation.enterAnimation.duration', 'animation.text.enter.duration'],
        ['animation.enterAnimation.delay', 'animation.text.enter.delay'],
        ['animation.loopAnimation.animationType', 'animation.curve.loop.type'],
        ['animation.loopAnimation.duration', 'animation.curve.loop.duration'],
        ['animation.loopAnimation.delay', 'animation.curve.loop.delay'],
        ['animation.loopAnimation.singleColor', 'animation.curve.loop.color'],
        ['animation.loopAnimation.animationDirection', 'animation.curve.loop.direction'],
        ['animation.loopAnimation.scope', 'animation.curve.loop.scope'],
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
        ['base.axisBinding', 'options.axis'],
        ['base.type', 'options.type'],
        ['base.mode', 'options.mode'],
        ['base.width', 'style.rectWidth'],
        ['base.gap', 'style.rectInterval'],
        ['base.color.colorList', 'style.colorList'],
        // ['base.color.colorType', 'style.rect.colorType'],
        // ['base.color.singleColor', 'style.rect.fill'],
        // ['base.color.gradientColor', 'style.rect.gradientColor'],
        // ['base.color.rangeColors', 'style.rangeColorList'],
        ['base.legendType', 'style.shape'],
        ['base.rect.rectRadius', 'style.rectRadius'],
        ['base.stroke.singleColor', 'style.rect.stroke'],
        ['base.stroke.width', 'style.rect.strokeWidth'],
        ['base.stroke.opacity', 'style.rect.strokeOpacity'],

        // 背景
        ['background.singleColor', 'style.background.fill'],
        ['background.opacity', 'style.background.fillOpacity'],
        // 标签
        ['label.labelPosition', 'style.labelPosition'],
        ['label.offset', 'style.text.offset'],
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
        ['tooltip.show', 'options.tooltipOption.visible'],
        ['unit.show', 'style.unit.showUnit'],
        ['unit.textSize', 'style.unit.fontSize'],
        ['unit.singleColor', 'style.unit.fill'],
        ['unit.offset', 'style.unit.offset'],
        ['unit.content', 'style.unit.data'],
        // 动画
        ['animation.enterAnimation.animationType', 'animation.rect.enter.type'],
        ['animation.enterAnimation.duration', 'animation.rect.enter.duration'],
        ['animation.enterAnimation.delay', 'animation.rect.enter.delay'],
        ['animation.enterAnimation.animationType', 'animation.text.enter.type'],
        ['animation.enterAnimation.duration', 'animation.text.enter.duration'],
        ['animation.enterAnimation.delay', 'animation.text.enter.delay'],
        // ['animation.enterAnimation.delay', 'animation.text.enter.delay'],
        ['animation.loopAnimation.animationType', 'animation.rect.loop.type'],
        ['animation.loopAnimation.duration', 'animation.rect.loop.duration'],
        ['animation.loopAnimation.delay', 'animation.rect.loop.delay'],
        ['animation.loopAnimation.singleColor', 'animation.rect.loop.color'],
        ['animation.loopAnimation.animationDirection', 'animation.rect.loop.direction'],
        ['animation.loopAnimation.scope', 'animation.rect.loop.scope'],
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
      if (getOption('base.rect.rectStepPercentage') !== 0 && getOption('base.rect.rectStepPercentage') !== null) {
        storage.set('style.rectStep', {
          show:
            getOption('base.rect.rectStepPercentage') === 0 && getOption('base.rect.rectStepPercentage') === null
              ? false
              : true,
          percentage: getOption('base.rect.rectStepPercentage'),
          gap: getOption('base.rect.rectStepPercentage') / 2,
        })
        storage.set('animation', {})
      }

      return storage.get()
    },
  ],
  [
    'radar',
    ({mapOption, getOption}) => {
      const mapping = [
        ['base.color.colorList', 'style.colorList'],
        ['base.mode', 'options.mode'],
        // 点
        ['point.size', 'style.circleSize'],
        // 面
        ['area.opacity', 'style.polygon.fillOpacity'],
        // 线
        ['line.lineWidth', 'style.polygon.strokeWidth'],
        // 标签
        ['label.labelPosition', 'style.labelPosition'],
        ['label.offset', 'style.text.offset'],
        ['label.decimalPlaces', 'style.text.format.decimalPlace'],
        ['label.thousandDiv', 'style.text.format.thousandth'],
        ['label.percentage', 'style.text.format.percentage'],
        ['label.text.textSize', 'style.text.fontSize'],
        ['label.text.textWeight', 'style.text.fontWeight'],
        ['label.text.singleColor', 'style.text.fill'],
        ['label.text.opacity', 'style.text.fillOpacity'],
        ['tooltip.show', 'options.tooltipOption.visible'],
        ['unit.show', 'style.unit.showUnit'],
        ['unit.textSize', 'style.unit.fontSize'],
        ['unit.singleColor', 'style.unit.fill'],
        ['unit.offset', 'style.unit.offset'],
        ['unit.content', 'style.unit.data'],
        // 标签阴影
        ['label.shadow.offset', 'style.text.shadow.offset'],
        ['label.shadow.blur', 'style.text.shadow.blur'],
        ['label.shadow.singleColor', 'style.text.shadow.color'],
      ]
      const storage = mapOption(mapping)
      if (getOption('label.effective') !== undefined) {
        storage.set('style.text.hide', !getOption('label.effective'))
      }
      if (getOption('area.effective') === false) {
        storage.set('style.polygon.fillOpacity', 0)
      }
      return storage.get()
    },
  ],
  [
    'polar',
    ({mapOption}) => {
      const mapping = [
        // 比例尺
        ['base.tickCount', 'scale.count'],
        ['base.tickZero', 'scale.zero'],
        ['base.type', 'options.type'],
      ]
      const storage = mapOption(mapping)

      return storage.get()
    },
  ],
  [
    'arc',
    ({mapOption, getOption}) => {
      const mapping = [
        ['base.mode', 'options.mode'],
        ['base.type', 'options.type'],
        ['base.color.colorList', 'style.colorList'],
        ['base.innerRadius', 'style.innerRadius'],
        // 标签
        ['label.labelPosition', 'style.labelPosition'],
        ['label.text.textSize', 'style.text.fontSize'],
        ['label.text.textWeight', 'style.text.fontWeight'],
        ['label.text.singleColor', 'style.text.fill'],
        ['label.text.opacity', 'style.text.fillOpacity'],
        // 标签阴影
        ['label.shadow.offset', 'style.text.shadow.offset'],
        ['label.shadow.blur', 'style.text.shadow.blur'],
        ['label.shadow.singleColor', 'style.text.shadow.color'],
        ['tooltip.show', 'options.tooltipOption.visible'],
        ['unit.show', 'style.unit.showUnit'],
        ['unit.textSize', 'style.unit.fontSize'],
        ['unit.singleColor', 'style.unit.fill'],
        ['unit.offset', 'style.unit.offset'],
        ['unit.content', 'style.unit.data'],
      ]
      const storage = mapOption(mapping)
      if (getOption('label.effective') !== undefined) {
        storage.set('style.text.hide', !getOption('label.effective'))
      }

      return storage.get()
    },
  ],
  [
    'scatter',
    ({mapOption}) => {
      const mapping = [
        ['base.pointSize', 'style.pointSize'],
        ['base.color.colorList', 'style.colorList'],
        ['tooltip.show', 'options.tooltipOption.visible'],
        ['unit.show', 'style.unit.showUnit'],
        ['unit.textSize', 'style.unit.fontSize'],
        ['unit.singleColor', 'style.unit.fill'],
        ['unit.offset', 'style.unit.offset'],
        ['unit.content', 'style.unit.data'],
      ]
      const storage = mapOption(mapping)
      // 把散点上的标签隐藏了
      storage.set('style.text.hide', true)

      return storage.get()
    },
  ],
  [
    'dashboard',
    ({mapOption}) => {
      const mapping = [
        // 基础
        // ['base.axisBinding', 'options.axis'],
        // ['base.mode', 'options.mode'],centerText
        ['line.tickSize', 'style.tickSize'],
        ['line.lineWidth', 'style.arcWidth'],
        ['color.colorList', 'style.colorList'],
        // 圆心
        ['text.centerText.textSize', 'style.valueText.fontSize'],
        ['text.centerText.textWeight', 'style.valueText.fontWeight'],
        ['text.centerText.singleColor', 'style.valueText.fill'],
        ['text.centerText.opacity', 'style.valueText.fillOpacity'],
        ['text.centerText.offset', 'style.valueText.offset'],
        // 圆内
        ['text.circleText.textSize', 'style.tickText.fontSize'],
        ['text.circleText.textWeight', 'style.tickText.fontWeight'],
        ['text.circleText.singleColor', 'style.tickText.fill'],
        ['text.circleText.opacity', 'style.tickText.fillOpacity'],
        // ['text.circleText.offset', 'style.tickText.offset'],
        ['tooltip.show', 'options.tooltipOption.visible'],
        // 园外
        ['text.outsideText.textSize', 'style.labelText.fontSize'],
        ['text.outsideText.textWeight', 'style.labelText.fontWeight'],
        ['text.outsideText.singleColor', 'style.labelText.fill'],
        ['text.outsideText.opacity', 'style.labelText.fillOpacity'],
        ['text.outsideText.offset', 'style.labelText.offset'],
      ]
      const storage = mapOption(mapping)
      // if (getOption('area.effective') !== undefined) {
      //   storage.set('style.area.hide', !getOption('area.effective'))
      // }
      // if (getOption('label.effective') !== undefined) {
      //   storage.set('style.text.hide', !getOption('label.effective'))
      // }
      return storage.get()
    },
  ],
  [
    'edgeBundle',
    ({mapOption}) => {
      const mapping = [
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
        ['text.opacity', 'style.text.fillOpacity'],
        ['text.labelOffset', 'style.labelOffset'],
        ['base.pointSize', 'style.circleSize'],
        ['base.lineWidth', 'style.curve.strokeWidth'],
        ['base.color.colorList', 'style.colorList'],
        ['tooltip.show', 'options.tooltipOption.visible'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'chord',
    ({mapOption}) => {
      const mapping = [
        ['color.colorList', 'style.colorList'],
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
        ['text.opacity', 'style.text.fillOpacity'],
        ['text.labelOffset', 'style.labelOffset'],
        ['base.lineWidth', 'style.arcWidth'],
        ['tooltip.show', 'options.tooltipOption.visible'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'sankey',
    ({mapOption}) => {
      const mapping = [
        ['color.colorList', 'style.colorList'],
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
        ['text.opacity', 'style.text.fillOpacity'],
        ['text.labelOffset', 'style.labelOffset'],
        ['node.sankeyAlign', 'style.align'],
        ['node.nodeWidth', 'style.nodeWidth'],
        ['node.nodeGap', 'style.nodeGap'],
        ['tooltip.show', 'options.tooltipOption.visible'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'tree',
    ({mapOption}) => {
      const mapping = [
        ['base.color.colorList', 'style.colorList'],
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
        ['text.opacity', 'style.text.fillOpacity'],
        ['text.labelOffset', 'style.labelOffset'],
        ['line.sankeyAlign', 'style.align'],
        ['line.lineWidth', 'style.curve.strokeWidth'],
        ['line.opacity', 'style.curve.strokeOpacity'],
        ['line.lineCurve', 'style.curve.curve'],
        ['base.direction', 'options.type'],
        ['tooltip.show', 'options.tooltipOption.visible'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'pack',
    ({mapOption}) => {
      const mapping = [
        ['color.colorList', 'style.colorList'],
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
        ['text.opacity', 'style.text.fillOpacity'],
        ['tooltip.show', 'options.tooltipOption.visible'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'treemap',
    ({mapOption}) => {
      const mapping = [
        ['color.colorList', 'style.colorList'],
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
        ['text.opacity', 'style.text.fillOpacity'],
        ['tooltip.show', 'options.tooltipOption.visible'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'matrix',
    ({mapOption}) => {
      const mapping = [
        ['color.colorList', 'style.colorList'],
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
        ['text.opacity', 'style.text.fillOpacity'],
        ['tooltip.show', 'options.tooltipOption.visible'],
        ['unit.show', 'style.unit.showUnit'],
        ['unit.textSize', 'style.unit.fontSize'],
        ['unit.singleColor', 'style.unit.fill'],
        ['unit.offset', 'style.unit.offset'],
        ['unit.content', 'style.unit.data'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'baseMap',
    ({mapOption}) => {
      const mapping = [
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
        ['text.opacity', 'style.text.fillOpacity'],
        ['base.opacity', 'style.block.fillOpacity'],
        ['base.singleColor', 'style.block.fill'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'odLine',
    ({mapOption}) => {
      const mapping = [
        ['base.singleColor', 'style.flyingObject.fill'],
        ['line.singleColor', 'style.odLine.stroke'],
        ['line.lineWidth', 'style.odLine.strokeWidth'],
        // ['line.opacity', 'style.odLine.fillOpacity'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'timeline',
    ({mapOption}) => {
      const mapping = [
        ['text.textSize', 'style.event.fontSize'],
        ['text.textWeight', 'style.event.fontWeight'],
        ['text.singleColor', 'style.event.color'],
        ['text.opacity', 'style.event.opacity'],
        ['background.singleColor', 'style.event.backgroundColor'],
        // ['background.borderRadius', 'style.event.borderRadius'],
        ['timeline.circleSize', 'style.timeline.circleSize'],
        ['timeline.singleColor', 'style.timeline.circleColor'],
        ['line.singleColor', 'style.timeline.lineColor'],
        ['line.lineWidth', 'style.timeline.lineWidth'],
        ['tooltip.show', 'options.tooltipOption.visible'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'auxiliary',
    ({mapOption, getOption}) => {
      const mapping = [
        ['calibration.calibrationTitle', 'data.titleOne'],
        ['calibration.calibrationTitle', 'data.valueOne'],
        ['calibration.calibrationValue', 'data.valueOne'],

        ['text.relativePosition', 'style.labelPosition'],
        ['line.lineWidth', 'style.line.strokeWidth'],
        ['line.singleColor', 'style.line.stroke'],
        ['line.opacity', 'style.line.strokeOpacity'],
        ['text.textSize', 'style.text.fontSize'],
        ['text.textWeight', 'style.text.fontWeight'],
        ['text.singleColor', 'style.text.fill'],
      ]
      const storage = mapOption(mapping)
      if (getOption('calibration.calibrationTitle')) {
        storage.set('data', [
          ['标签', '数值'],
          [getOption('calibration.calibrationTitle'), getOption('calibration.calibrationValue')],
        ])
      }
      if (getOption('line.dasharrayLength')) {
        const Length = getOption('line.dasharrayLength').toString()
        const Spacing = getOption('line.dasharraySpacing').toString()
        storage.set('style.line.dasharray', `${Length}  ${Spacing}`)
      }
      if (getOption('line.dasharraySpacing')) {
        const Length = getOption('line.dasharrayLength').toString()
        const Spacing = getOption('line.dasharraySpacing').toString()
        storage.set('style.line.dasharray', `${Length} ${Spacing}`)
      }
      if (getOption('calibration.direction')) {
        storage.set('options.type', getOption('calibration.direction'))
      }
      return storage.get()
    },
  ],
])
