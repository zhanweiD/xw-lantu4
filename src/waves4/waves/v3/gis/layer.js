export default () => {
  return {
    name: '基础地图层',
    type: 'gis', // 必要
    sections: [
      {
        name: 'gisSpecialEffects',
        fields: [{name: 'gisRain'}, {name: 'gisSnow'}, {name: 'gisElevation'}],
      },
    ],
  }
}
