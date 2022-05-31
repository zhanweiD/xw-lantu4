import {cartesian, rect, title} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'intervalBar',
  name: k('intervalBar'),
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
  layers: [rect({k, column: ['最低温度', '最高温度'], type: 'bar', mode: 'interval'})],
  // 标题面板
  title: title({k, content: '某地区一周内温度变化'}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true, type: 'linearX-bandY'}),
})
