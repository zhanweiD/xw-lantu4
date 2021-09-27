import {getLayersConfig, textLayer, rectLayer, legendLayer, axisLayer} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'stackColumn',
  name: k('stackColumn'),
  // 图表容器初始化的大小
  layout: () => [500, 300],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: 'cartesian-bandX-linearY',
  // 追加图层
  getLayersConfig: () => getLayersConfig('cartesian-bandX-linearY'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: 'text',
      type: 'text',
      name: '标题层',
      children: textLayer.children(),
      other: textLayer.other({
        content: '近五年国家旅客对比',
      }),
    },
    {
      key: 'legend',
      type: 'legend',
      name: '图例层',
      children: legendLayer.children(),
      other: legendLayer.other({}),
    },
    {
      key: 'rect',
      type: 'rect',
      name: '矩形层',
      axis: 'main', // minor
      children: rectLayer.children(),
      other: rectLayer.other({
        type: 'column',
        mode: 'stack',
      }),
      dataConfig: [
        [
          {
            name: '矩形层-数值',
            type: ['string', 'number'],
            range: [1, Infinity],
            value: [
              {
                key: '铁路旅客',
                name: '铁路旅客',
                type: 'number',
              },
              {
                key: '公路旅客',
                name: '公路旅客',
                type: 'number',
              },
              {
                key: '民用航空旅客',
                name: '民用航空旅客',
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
      children: axisLayer.children(null, 'cartesian-bandX-linearY'),
      other: axisLayer.other({
        extendZero: true,
      }),
    },
  ],
  // 数据
  data: {
    type: 'json',
    json: data,
    dimension: [
      {
        name: '矩形层-维度',
        type: ['string'],
        range: [1, 1],
        value: [
          {
            key: '年份',
            name: '年份',
            type: 'string',
          },
        ],
      },
    ],
  },
  // 交互
  interaction: {},
})
