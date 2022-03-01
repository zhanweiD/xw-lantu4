import {title, edgeBundle} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'edgeBundle',
  name: k('edgeBundle'),
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [60, 60, 60, 60],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  // coordinate: 'polar',
  // 追加图层
  // getLayersConfig: () => getLayersConfig('polar'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [edgeBundle()],
  title: title({k, content: '边缘捆图'}),
  // 数据
  data,
  // 交互
  // interaction: {},
})
