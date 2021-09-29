import {getLayersConfig, textLayer, arcLayer, axisLayer, legendLayer} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'donut',
  name: k('donut'),
  // 图表容器初始化的大小
  layout: () => [400, 300],
  // 图表主绘图区域的内边距
  padding: [60, 30, 30, 0],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: 'polar-bandAngle-linearRadius',
  // 追加图层
  getLayersConfig: () => getLayersConfig('polar-bandAngle-linearRadius'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: 'text',
      type: 'text',
      name: '标题层',
      children: textLayer.children(),
      other: textLayer.other({
        content: '2017百度科普主题搜索占比',
      }),
    },
    {
      key: 'legend',
      type: 'legend',
      name: '图例层',
      children: legendLayer.children(),
      other: legendLayer.other({
        alignment: 'middle-right',
        direction: 'vertical',
      }),
    },
    {
      key: 'arc',
      type: 'arc',
      name: '圆弧层',
      children: arcLayer.children(),
      other: arcLayer.other({
        type: 'pie',
        innerRadius: 50,
      }),
      dataConfig: [
        [
          {
            name: '圆弧层-数值',
            type: ['string', 'number'],
            range: [1, Infinity],
            value: [
              {
                key: '占比',
                name: '占比',
                type: 'number',
              },
            ],
          },
        ],
      ],
    },
    {
      key: 'axis',
      type: 'axis',
      name: '坐标轴层',
      children: axisLayer.children(null, 'polar-bandAngle-linearRadius'),
      other: axisLayer.other(),
    },
  ],
  // 数据
  data: {
    type: 'json',
    json: data,
    dimension: [
      {
        name: '圆弧层-维度',
        type: ['string'],
        range: [1, 1],
        value: [
          {
            key: '类别',
            name: '类别',
            type: 'string',
          },
        ],
      },
    ],
  },
  // 交互
  interaction: {},
})
