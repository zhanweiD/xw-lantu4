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
        ['legend.show', 'legendVisible'],
        ['legend.textSize', 'legendSize'],
        ['legend.singleColor', 'legendColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
