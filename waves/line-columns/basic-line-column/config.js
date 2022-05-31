import {cartesian, legend, rect, line, title} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'basicLineColumn',
  name: k('basicLineColumn'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['年份'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  layers: [
    line({k, column: ['GDP增速'], mode: 'group', axis: 'minor'}),
    rect({k, type: 'column', mode: 'group', column: ['GDP总量'], labelPosition: 'top-outer'}),
  ],
  // 标题面板
  title: title({k, content: '中国近十年GDP总量与增速'}),
  // 图例面板
  legend: legend({k}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true}),
})
