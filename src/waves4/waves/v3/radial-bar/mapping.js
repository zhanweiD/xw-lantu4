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
        ['label.valueVisible', 'valueVisible'],
        ['value.valueColor', 'valueColor'],
        ['circle.circleOpacity', 'circleOpacity'],
        ['circle.circleMaxRadius', 'circleMaxRadius'],
        ['legend.show', 'legendVisible'],
        ['legend.textSize', 'legendSize'],
        ['legend.singleColor', 'legendColor'],
        ['arc.arcWidth', 'arcWidth'],
        ['arc.minRadius', 'minRadius'],
        ['arc.arcGap', 'arcGap'],
        ['arc.order', 'order'],
        ['arc.arcBackgroundWidth', 'arcBackgroundWidth'],
        ['arc.arcBackgroundColor', 'arcBackgroundColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
