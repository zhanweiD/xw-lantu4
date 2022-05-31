export default () => {
  return {
    name: '基础地图层',
    type: 'gis', // 必要
    sections: [
      {
        name: 'base',
        fields: [{name: 'layerName'}, {name: 'mapService'}, {name: 'gisTheme'}],
      },
    ],
  }
}
