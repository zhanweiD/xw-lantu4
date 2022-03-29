export const layerOptionMap = new Map([
  [
    'gis',
    ({mapOption}) => {
      const mapping = [
        // ['base.layerName', 'layerName'],
        // ['base.mapService', 'mapService'],
        // ['base.gisTheme', 'gisTheme'],
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
])
