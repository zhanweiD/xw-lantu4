export default () => {
  return {
    name: 'GeoJSON',
    type: 'geojson', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisElevation'}],
      },
    ],
  }
}
