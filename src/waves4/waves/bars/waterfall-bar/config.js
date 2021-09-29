import {cartesian, rect, title} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'waterfallBar',
  name: k('waterfallBar'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['消费类型'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  layers: [rect({k, column: ['支出'], type: 'bar', mode: 'waterfall'})],
  // 标题面板
  title: title({k, content: '某月消费情况分析'}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true, type: 'linearX-bandY'}),
})
