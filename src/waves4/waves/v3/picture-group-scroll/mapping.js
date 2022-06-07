export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = []
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
