import {title, legend, radar, polar} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'groupRadar',
  name: k('groupRadar'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['分类'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 折线图层
  layers: [radar({k, mode: 'stack', column: ['预算', '实际支出']})],
  // 标题面板
  title: title({k, content: '某公司财政预算和实际支出对比'}),
  // 图例面板
  legend: legend({k}),
  // 极坐标系坐标轴
  polar: polar({k}),
})
