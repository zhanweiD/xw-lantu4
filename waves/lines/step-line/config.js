import {title, legend, cartesian, line} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'stepLine',
  name: k('stepLine'),
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
  // 折线图层
  layers: [
    line({
      k,
      mode: 'group',
      lineCurve: 'curveStep',
      column: ['猪肉CPI'],
    }),
  ],
  // 标题面板
  title: title({k, content: '2018上半年猪肉CPI走势'}),
  // 图例面板
  legend: legend({k}),
  // 直角坐标系坐标轴
  axis: cartesian({k}),
})
