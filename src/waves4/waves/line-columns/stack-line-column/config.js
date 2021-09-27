import {cartesian, legend, rect, line, title} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'stackLineColumn',
  name: k('stackLineColumn'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['日期'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  layers: [
    line({k, axis: 'minor', column: ['GDP增长']}),
    rect({k, column: ['第一产业累计值', '第二产业累计值', '第三产业累计值']}),
  ],
  // 标题面板
  title: title({k, content: '2018-2019季度GDP概况'}),
  // 图例面板
  legend: legend({k, position: 'bottomCenter'}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true}),
})
