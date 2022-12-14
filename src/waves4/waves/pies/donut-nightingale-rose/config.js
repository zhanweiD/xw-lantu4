import {title, legend, arc, polar, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'donutNightingaleRose',
  name: k('donutNightingaleRose'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['月份'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 圆弧图层
  layers: [arc({k, mode: 'default', type: 'nightingaleRose', innerRadius: 30, column: ['铁路旅客周转量']})],
  // 标题面板
  title: title({k, content: '国家旅客周转量对比'}),
  // 图例面板
  legend: legend({k}),
  // 极坐标系坐标轴
  polar: polar({k}),

  auxiliary: auxiliary({k, type: 'horizontal'}),
})
