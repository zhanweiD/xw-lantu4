export const layerOptionMap = new Map([
  [
    'gis',
    ({mapOption}) => {
      const mapping = [
        // ['base.layerName', 'layerName'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'gisPoint',
    ({mapOption}) => {
      const mapping = []
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'gisHeatmap',
    ({mapOption}) => {
      const mapping = []
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
