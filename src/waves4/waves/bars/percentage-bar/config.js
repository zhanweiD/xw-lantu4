import {cartesian, legend, rect, title, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'percentageBar',
  name: k('percentageBar'),
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
  layers: [rect({k, column: ['铁路旅客', '公路旅客', '民用航空旅客'], type: 'bar', mode: 'percentage'})],
  // 标题面板
  title: title({k, content: '近五年国家旅客对比'}),
  // 图例面板
  legend: legend({k, direction: 'vertical'}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true, percentage: true, type: 'linearX-bandY'}),

  auxiliary: auxiliary({k, type: 'horizontal'}),
})
