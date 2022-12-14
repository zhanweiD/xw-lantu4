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
        // ['axis.labelOffset', 'xTickOffset'],
        // ['axis.textSize', 'xTickSize'],
        // ['axis.singleColor', 'xTickColor'],
        ['axis.labelOffset', 'offsetY'],
        ['axis.textSize', 'yTickSize'],
        ['axis.singleColor', 'yTickColor'],
        ['unit.show', 'unitVisible'],
        ['unit.textSize', 'unitSize'],
        ['unit.singleColor', 'unitColor'],
        ['unit.offset', 'unitOffset'],
        ['unit.content', 'unitContent'],
        ['color.effective', 'useColors'],
        ['color.colorType2', 'checkColorModel'],
        ['color.singleColor', 'customColors'],
        ['color.rangeColors', 'rangeColors'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
