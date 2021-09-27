import {title, legend, cartesian, rect} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'basicColumn',
  name: k('basicColumn'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['成员名称'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  layers: [rect({k})],
  // 标题面板
  title: title({k, content: '基础柱状'}),
  // 图例面板
  legend: legend({k}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true}),
})
