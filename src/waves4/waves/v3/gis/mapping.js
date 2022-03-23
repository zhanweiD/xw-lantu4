export const layerOptionMap = new Map([
  [
    'gisBase',
    () => [
      ['base.gisPosition', 'origin'],
      ['base.gisAngle', 'viewport'],
      ['base.gisBackground', 'backgroundColor'],
      ['base.gisProjection', 'sceneMode'],
      ['base.gisInteraction', 'showMask'],
      ['base.gisAngleFixed', 'viewFixed'],
      ['base.gisClickXY', 'coordinateAcquisitionResult'],
      ['gisSpecialEffects.gisRain', 'rain'],
      ['gisSpecialEffects.gisSnow', 'snow'],
      ['gisSpecialEffects.gisElevation', 'terrain'],
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
      const mapping = [['base.gisElevation', 'gisElevation']]
      const storage = mapOption(mapping)
      return storage.get()
    },
  ],
])
