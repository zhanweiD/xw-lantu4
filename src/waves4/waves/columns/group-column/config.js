import {cartesian, legend, rect, title} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'groupColumn',
  name: k('groupColumn'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['省份'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  layers: [
    rect({
      k,
      column: ['本科院校', '高职院校'],
      type: 'column',
      mode: 'group',
      labelPosition: ['bottom-outer', 'top-outer'],
    }),
  ],
  // 标题面板
  title: title({k, content: '部分省份院校数量对比'}),
  // 图例面板
  legend: legend({k}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true}),
})
