export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['title.show', 'titleVisible'],
        ['title.content', 'titleText'],
        ['title.textSize', 'titleSize'],
        ['title.singleColor', 'titleColor'],
        ['label.labelSize', 'labelSize'],
        ['label.labelColor', 'labelColor'],
        ['label.labelAngle', 'labelAngle'],
        ['label.labelOffsetY', 'labelOffsetY'],
        ['line.lineOpacity', 'lineOpacity'],
        ['line.lineColor', 'lineColor'],
        ['value.valueSize', 'valueSize'],
        ['value.valueColor', 'valueColor'],
        ['circle.circleOpacity', 'circleOpacity'],
        ['circle.circleMaxRadius', 'circleMaxRadius'],
        ['unit.show', 'unitVisible'],
        ['unit.textSize', 'unitSize'],
        ['unit.singleColor', 'unitColor'],
        ['unit.offset', 'unitOffset'],
        ['unit.content', 'unitContent'],
        ['circle.color.effective', 'useColors'],
        ['circle.color.colorType2', 'checkColorModel'],
        ['circle.color.singleColor', 'customColors'],
        ['circle.color.rangeColors', 'rangeColors'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
