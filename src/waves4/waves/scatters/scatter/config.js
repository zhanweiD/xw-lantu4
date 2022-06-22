import {cartesian, legend, scatter, title, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'scatter',
  name: k('scatter'),
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
  layers: [scatter({k, pointSize: [10, 10]})],
  // 标题面板
  title: title({k, content: '散点图'}),
  // 图例面板
  legend: legend({k}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true, type: 'linearX-bandY'}),

  auxiliary: auxiliary({k, type: 'horizontal'}),
})
