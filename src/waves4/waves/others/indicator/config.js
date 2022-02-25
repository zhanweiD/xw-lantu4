import {dashboard, title} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'cicularIndicator',
  name: k('cicularIndicator'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  layers: [dashboard({k, name: '环形指标卡', type: 'indicator'})],

  // 标题面板
  title: title({k, content: '某APP活跃用户年龄分布'}),
})
