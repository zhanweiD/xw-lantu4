export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [['base.show', 'titleVisible']]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
