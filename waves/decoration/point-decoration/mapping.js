export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.dure', 'time'],
        ['base.shape', 'shapeType'],
        ['base.color', 'colorType'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
