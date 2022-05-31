export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['title.show', 'titleVisible'],
        ['title.content', 'titleText'],
        ['title.textSize', 'titleSize'],
        ['title.singleColor', 'titleColor'],
        ['legend.show', 'legendVisible'],
        ['legend.textSize', 'legendSize'],
        ['legend.singleColor', 'legendColor'],
        ['arc.valueVisible', 'valueVisible'],
        ['arc.valueSize', 'valueSize'],
        ['arc.valueColor', 'valueColor'],
        ['arc.decimalNumber', 'decimalNumber'],
        ['arc.arcLineColor', 'arcLineColor'],
        ['arc.orderType', 'orderType'],
        ['arc.color.effective', 'useColors'],
        ['arc.color.colorType2', 'checkColorModel'],
        ['arc.color.singleColor', 'customColors'],
        ['arc.color.rangeColors', 'rangeColors'],
        ['axis.labelOffset', 'xTickOffset'],
        ['axis.textSize', 'xTickSize'],
        ['axis.singleColor', 'xTickColor'],
        ['axis.labelOffset', 'offsetY'],
        ['axis.textSize', 'yTickSize'],
        ['axis.singleColor', 'yTickColor'],
        ['unit.show', 'unitVisible'],
        ['unit.textSize', 'unitSize'],
        ['unit.singleColor', 'unitColor'],
        ['unit.offset', 'unitOffset'],
        ['unit.content', 'unitContent'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
