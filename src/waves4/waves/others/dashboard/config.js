import {dashboard, title, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'dashboard',
  name: k('dashboard'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  layers: [dashboard({k, name: '仪表盘', type: 'dashboard'})],

  // 标题面板
  title: title({k, content: '仪表盘'}),

  // 直角坐标系坐标轴
  auxiliary: auxiliary({k, type: 'horizontal'}),
})
