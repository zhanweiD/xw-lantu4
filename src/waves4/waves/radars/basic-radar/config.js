import {title, legend, radar, polar} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'basicRadar',
  name: k('basicRadar'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['供应商'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 雷达图层
  layers: [radar({k, mode: 'stack', column: ['市场份额']})],
  // 标题面板
  title: title({k, content: '手机厂商市场份额'}),
  // 图例面板
  legend: legend({k}),
  // 极坐标系坐标轴
  polar: polar({k}),
})
