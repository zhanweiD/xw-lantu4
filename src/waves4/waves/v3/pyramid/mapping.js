export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['basic.padding', 'padding'],
        ['basic.orderType', 'order'],
        ['basic.DIRECTION', 'direction'],
        ['basic.color.effective', 'useColors'],
        ['basic.color.colorType2', 'checkColorModel'],
        ['basic.color.singleColor', 'customColors'],
        ['basic.color.rangeColors', 'rangeColors'],
        //标题
        ['title.show', 'titleVisible'],
        ['title.content', 'titleText'],
        ['title.textSize', 'titleSize'],
        ['title.singleColor', 'titleColor'],
        // 标签
        ['label.labelSize', 'labelSize'],
        ['label.labelColor', 'labelColor'],
        ['label.gap', 'labelGap'],
        ['xAxis.textSize', 'waveXTickSize'],
        ['xAxis.tickCount', 'waveTickCount'],
        ['xAxis.opacity', 'waveTickOpacity'],
        ['xAxis.singleColor', 'waveXTickColor'],
        ['xAxis.labelOffset', 'barGap'],

        //数值
        ['value.valueVisible', 'valueVisible'],
        ['value.valueInPosition', 'valuePosition'],
        ['value.decimalNumber', 'decimalNumber'],
        ['value.groupBarGap', 'groupBarGap'],

        ['value.valueSize', 'valueSize'],
        ['value.singleColor', 'valueColor'],
        ['value.width', 'barWidth'],
        ['value.showShadow', 'valueShadowVisible'],
        ['value.shadowOptions', 'valueShadowOffset'],
        ['value.noLabelColor', 'valueShadowColor'],
        ['unit.show', 'unitVisible'],
        ['unit.textSize', 'unitSize'],
        ['unit.singleColor', 'unitColor'],
        ['unit.offset', 'unitOffset'],
        ['unit.content', 'unitContent'],
        // 其他选项
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
