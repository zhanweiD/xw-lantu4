import {title, sankey} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'sankey',
  name: k('sankey'),
  // 图表容器初始化的大小
  layout: () => [12, 6],
  // 图表主绘图区域的内边距
  padding: [60, 0, 10, 0],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  // coordinate: 'polar',
  // 追加图层
  // getLayersConfig: () => getLayersConfig('polar'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [sankey()],
  scale: {
    fixedBandwidth: 7,
  },
  // 数据
  data,
  title: title({k, content: '某APP活跃用户年龄分布'}),
  // 交互
  // interaction: {},
})
