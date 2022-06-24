import {cartesian, legend, scatter, title, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'bubble',
  name: k('bubble'),
  data,
  // dimension: {
  //   fields: [
  //     {
  //       name: 'xColumn',
  //       defaultValue: [],
  //     },
  //   ],
  // },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  // TODO:
  // 这里的pointSize应该改成和图表库那样的 [10, 30]。等到最新的图表库发布
  layers: [scatter({k, pointSize: [30, 10]})],
  // 标题面板
  title: title({k, content: '气泡图'}),
  // 图例面板
  legend: legend({k}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true, type: 'linearX-bandY'}),

  auxiliary: auxiliary({k, type: 'horizontal'}),
})
