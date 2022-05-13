export default () => {
  return {
    name: '散点气泡层',
    type: 'gisPoint', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {name: 'type'},
          {name: 'extruded'},
          {name: 'getElevationValue'},
          // {name: 'diskResolution'},
          {name: 'label'},
          {name: 'labelSize', defaultValue: 12},
          {name: 'labelColor', defaultValue: 'rgba(255, 255, 255, 1)'},
          {name: 'opacity'},
          {name: 'getRadius'},
          {name: 'fillColor'},
          {name: 'stroked'},
          {name: 'getLineWidth'},
          {name: 'lineColor'},
          {name: 'isBreathe'},
        ],
      },
    ],
    data: [
      ['label', 'value', 'elevation', 'coordinates'],
      ['散点1', 100, 300, [120.1, 30]],
      ['散点2', 150, 400, [120.1, 30.1]],
    ],
  }
}
