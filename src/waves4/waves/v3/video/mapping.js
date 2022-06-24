export const layerOptionMap = new Map([
  [
    'layer',
    ({mapOption}) => {
      const mapping = [
        ['base.isMarkVisible', 'isMarkVisible'],
        ['base.backgroundColor', 'backgroundColor'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
