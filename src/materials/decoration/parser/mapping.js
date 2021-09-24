export const layerOptionMap = new Map([
  [
    'cornor',
    ({mapOption}) => {
      const mapping = []
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
