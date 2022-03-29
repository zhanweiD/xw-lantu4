export default () => {
  return {
    name: '热力层',
    type: 'gisHeatmap', // 必要
    sections: [],
    data: [
      ['centroid', 'value'],
      [[121.3, 30], 10],
      [[121.4, 30], 5],
    ],
  }
}
