import {cartesian, legend, rect, line, title, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'groupLineColumn',
  name: k('groupLineColumn'),
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
    line({k, axis: 'minor', mode: 'group', column: ['GDP增长']}),
    rect({
      k,
      type: 'column',
      mode: 'group',
      column: ['第一产业累计值', '第二产业累计值', '第三产业累计值'],
      labelPosition: 'top-outer',
    }),
  ],
  // 标题面板
  title: title({k, content: '2018-2019季度GDP概况'}),
  // 图例面板
  legend: legend({k, position: 'bottomCenter'}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true}),

  auxiliary: auxiliary({k, type: 'horizontal'}),
})
