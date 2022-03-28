export const layerOptionMap = new Map([
  [
    'gisBase',
    () => [
      ['base.origin', 'origin'],
      ['base.viewport', 'viewport'],
      ['base.backgroundColor', 'backgroundColor'],
      ['base.sceneMode', 'sceneMode'],
      ['base.enableMapInteractive', 'enableMapInteractive'],
      ['base.viewFixed', 'viewFixed'],
      ['base.coordinateAcquisitionResult', 'coordinateAcquisitionResult'],
      ['gisSpecialEffects.rain', 'rain'],
      ['gisSpecialEffects.snow', 'snow'],
      ['gisSpecialEffects.terrain', 'terrain'],
    ],
  ],
  [
    'gis',
    ({mapOption}) => {
      const mapping = [
        ['base.layerName', 'layerName'],
        ['base.mapService', 'mapService'],
        ['base.gisTheme', 'gisTheme'],
      ]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
  [
    'bimAmtn',
    ({mapOption}) => {
      const mapping = [['base.elevation', 'elevation']]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
