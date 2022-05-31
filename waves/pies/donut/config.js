import {title, legend, arc, polar} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'donut',
  name: k('donut'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['类别'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 圆弧图层
  layers: [arc({k, mode: 'default', innerRadius: 30, column: ['占比']})],
  // 标题面板
  title: title({k, content: '2017百度科普主题搜索占比'}),
  // 图例面板
  legend: legend({k}),
  // 极坐标系坐标轴
  polar: polar({k}),
})
