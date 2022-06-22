import {title, legend, cartesian, line, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'stackAreaLine',
  name: k('stackAreaLine'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['季度'],
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
      mode: 'stack',
      hasArea: true,
      lineCurve: 'curveMonotoneX',
      column: ['管理费用（亿元）', '销售费用（亿元）', '财务费用（亿元）'],
    }),
  ],
  // 标题面板
  title: title({k, content: '某公司上半年各项管理费用支出情况'}),
  // 图例面板
  legend: legend({k, position: 'bottomCenter'}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true}),

  auxiliary: auxiliary({k, type: 'horizontal'}),
})
