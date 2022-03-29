export default () => {
  return {
    name: '散点气泡层',
    type: 'gisPoint', // 必要
    sections: [],
    data: [
      ['label', 'radius', 'coordinates', 'setFillColor'],
      ['点层1', 10, [120.1, 30], [255, 0, 255, 255]],
      ['点层2', 10, [120.1, 30.1], [255, 0, 255, 255]],
    ],
  }
}
