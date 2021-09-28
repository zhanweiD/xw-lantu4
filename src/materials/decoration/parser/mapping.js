export const layerOptionMap = new Map([
  [
    'borderA',
    ({mapOption}) => {
      const mapping = [
        ['base.mode', 'options.mode'],
        ['base.size', 'style.shapeSize'],
        ['base.lineWidth', 'style.shape.strokeWidth'],
        ['base.singleColor', 'style.shape.stroke'],
        ['base.opacity', 'style.shape.strokeOpacity'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
