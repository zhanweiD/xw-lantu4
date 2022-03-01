import {title} from '@waves4/configs'

export const config = (k) => ({
  key: 'text',
  name: k('text'),
  // 数据
  // data,
  // 图表容器初始化的大小
  layout: () => [6, 3],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  // coordinate: 'any',
  // 追加图层
  // getLayersConfig: () => getLayersConfig('any'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [title({k, content: '文本内容'})],
  // 交互
  // interaction: {},
})
