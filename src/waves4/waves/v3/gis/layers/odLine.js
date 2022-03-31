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
        fields: [
          {name: 'greatCircle'},
          {name: 'getTilt'},
          {name: 'getHeight'},
          {name: 'getWidth'},

          {name: 'getSourceColor'},
          {name: 'sourcePoint'},
          {name: 'sourcePointSize'},
          {name: 'sourcePointColor'},
          {name: 'sourceLabel'},
          {name: 'sourceLabelSize'},
          {name: 'sourceLabelColor'},

          {name: 'getTargetColor'},
          {name: 'targetPoint'},
          {name: 'targetPointSize'},
          {name: 'targetPointColor'},
          {name: 'targetLabel'},
          {name: 'targetLabelSize'},
          {name: 'targetLabelColor'},

          // {name: 'flyPoint'},
          // {name: 'flyPointWidth'},
          // {name: 'flyPointColor'},
          // {name: 'flyPointSize'},
        ],
      },
    ],
    data: [
      ['sourcePosition', 'targetPosition', 'targetLabel', 'sourceLabel'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点1', '起点'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点2', '起点'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点3', '起点'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点4', '起点'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点5', '起点'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点6', '起点'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点7', '起点'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点8', '起点'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点9', '起点'],
      [[120, 30], [randomNum(-180, 180), randomNum(-30, 70)], '终点10', '起点'],
      // [[120, 30], [120.2, 30.4], '终点1', '起点'],
      // [[120, 30], [120.5, 30.3], '终点2', '起点'],
      // [[120, 30], [120.8, 30.2], '终点3', '起点'],
      // [[120, 30], [120.85, 30.1], '终点4', '起点'],
      // [[120, 30], [120.9, 30], '终点5', '起点'],
    ],
  }
}
