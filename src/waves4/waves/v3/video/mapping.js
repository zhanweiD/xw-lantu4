export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [['base.isMarkVisible', 'isMarkVisible']]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
