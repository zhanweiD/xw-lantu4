import {timeline, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'timeline',
  name: k('timeline'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  layers: [timeline()],

  auxiliary: auxiliary({k, type: 'horizontal'}),
})
