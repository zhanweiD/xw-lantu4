export default () => {
  return {
    name: '热力层',
    type: 'gisHeatmap', // 必要
    sections: [
      {
        name: 'base',
        fields: [{name: 'extruded'}, {name: 'radius'}, {name: 'heatmapType'}],
      },
    ],
    data: [
      ['centroid', 'value'],
      [[120.9, 30], 10],
      [[121.1, 30], 5],
    ],
  }
}
