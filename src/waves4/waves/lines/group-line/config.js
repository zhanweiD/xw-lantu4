import {title, legend, cartesian, line} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'groupLine',
  name: k('groupLine'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['统计时间'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 折线图层
  layers: [line({k, lineCurve: 'curveMonotoneX', column: ['第一产业（%）', '第二产业（%）', '第三产业（%）']})],
  // 标题面板
  title: title({k, content: '2017年国内不同产业GDP同比增长趋势'}),
  // 图例面板
  legend: legend({k, position: 'bottomCenter'}),
  // 直角坐标系坐标轴
  axis: cartesian({k}),
})
