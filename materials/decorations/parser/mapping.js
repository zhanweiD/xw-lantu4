export const layerOptionMap = new Map([
  [
    'borderA',
    ({mapOption}) => {
      const mapping = [
        ['mode', 'options.mode'],
        ['size', 'style.shapeSize'],
        ['lineWidth', 'style.shape.strokeWidth'],
        ['singleColor', 'style.shape.stroke'],
        ['opacity', 'style.shape.strokeOpacity'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
