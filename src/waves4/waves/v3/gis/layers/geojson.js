export default () => {
  return {
    name: 'GeoJSON',
    type: 'geojson', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {name: 'geojsonData'},
          {name: 'filled'},
          {name: 'getFillColor', defaultValue: 'rgba(255, 1, 1, 1)'},
          {name: 'stroked', defaultValue: true},
          {name: 'getLineWidth'},
          {name: 'getLineColor'},
          {name: 'extruded'},
          {name: 'geojsonType'},
          {name: 'wireframe'},
          // {name: 'getElevation'},
          {name: 'showLabel'},
          {name: 'labelSize'},
          {name: 'labelColor'},
          {name: 'billboard'},
          // {name: 'getAngle'},
          // {name: 'getTextAnchor'},
          // {name: 'getAlignmentBaseline'},
        ],
      },
    ],
    data: [
      ['label', 'center'],
      ['上海市', [121.472644, 31.231706]],
      ['江苏省', [118.767413, 32.041544]],
      ['浙江省', [120.153576, 30.287459]],
    ],
  }
}
