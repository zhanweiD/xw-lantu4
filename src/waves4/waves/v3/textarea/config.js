import layer from './layer'
import data from './data'

export const config = (k) => ({
  key: 'textarea',
  name: k('textarea'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [
    layer({k, content: '这是一个段落文本在段落中科院使用自定义关键词${key}来以数据驱动的方式往指定位置插入内容。${open}'})
  ],
})
