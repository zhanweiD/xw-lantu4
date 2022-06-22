import {baseMap, scatter, odLine, cartesian, title, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'baseMap',
  name: k('baseMap'),
  // 图表容器初始化的大小
  layout: () => [20, 15],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  // coordinate: 'polar',
  // 追加图层
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [odLine({k}), scatter({k}), baseMap()],
  title: title({k, content: '某APP活跃用户年龄分布'}),
  // 直角坐标系坐标轴
  axis: cartesian({k}),

  auxiliary: auxiliary({k, type: 'horizontal'}),
  // 数据
  data,
  // 交互
  // interaction: {},
  // axis: cartesian({k, tickZero: false, type: 'linearX-bandY'}),
})
