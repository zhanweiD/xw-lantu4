export default () => {
  //生成从minNum到maxNum的随机数
  function randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10)
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      default:
        return 0
    }
  }
  return {
    name: '飞线层',
    type: 'odLine', // 必要
    sections: [
      {
        name: 'base',
        fields: [{name: 'gisElevation'}],
      },
    ],
    data: [
      ['sourcePosition', 'targetPosition', 'targetLabel', 'sourceLabel'],
      [[120, 30], [randomNum(0, 180), randomNum(0, 70)], '终点', '起点'],
      [[120, 30], [randomNum(0, 180), randomNum(0, 70)], '终点', '起点'],
      [[120, 30], [randomNum(0, 180), randomNum(0, 70)], '终点', '起点'],
      [[120, 30], [randomNum(0, 180), randomNum(0, 70)], '终点', '起点'],
      [[120, 30], [randomNum(0, 180), randomNum(0, 70)], '终点', '起点'],
    ],
  }
}
