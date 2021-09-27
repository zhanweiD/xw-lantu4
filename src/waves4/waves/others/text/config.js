import {getLayersConfig, textLayer} from '@waves4/configs'

export const config = (k) => ({
  key: 'text',
  name: k('text'),
  // 图表容器初始化的大小
  layout: () => [200, 100],
  // 图表主绘图区域的内边距
  padding: [30, 30, 30, 30],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: 'any',
  // 追加图层
  getLayersConfig: () => getLayersConfig('any'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: 'text',
      type: 'text',
      name: '标题层',
      children: textLayer.children(),
      other: textLayer.other({
        content: '请输入文本内容',
      }),
    },
  ],
  // 数据
  data: {
    type: 'json',
    json: [],
  },
  // 交互
  interaction: {},
})
