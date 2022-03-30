export default () => {
  return {
    name: '散点气泡层',
    type: 'gisPoint', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {name: 'label'},
          {name: 'labelSize', defaultValue: 12},
          // {name: 'labelColor', defaultValue: 'rgba(255, 255, 255, 1)'},
          {name: 'opacity'},
          {name: 'stroked'},
          {name: 'isBreathe'},
        ],
      },
    ],
    data: [
      ['label', 'value', 'elevation', 'coordinates'],
      ['数据100', 100, 3000, [120.1, 30]],
      ['数据150', 150, 4000, [120.1, 30.1]],
    ],
  }
}
