export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['sizeSpecialDotMaterial', 'rectSize'],
        ['singleColor', 'rectFillColor'],
        ['opacity', 'rectOpacity'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
