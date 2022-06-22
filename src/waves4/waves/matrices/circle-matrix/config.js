import {matrix, title, cartesian, auxiliary} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'circleMatrix',
  name: k('circleMatrix'),
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  // coordinate: 'polar',
  // 追加图层
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [matrix({name: '圆形矩阵'})],
  title: title({k, content: '圆形矩阵'}),
  // 数据
  data,
  axis: cartesian({k, paddingInner: 0}),

  auxiliary: auxiliary({k, type: 'horizontal'}),
  // 交互
  // interaction: {},
})
