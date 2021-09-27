import {getLayersConfig, textLayer, rectLayer, legendLayer, axisLayer} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'basicBar',
  name: k('basicBar'),
  // 图表容器初始化的大小
  layout: () => [500, 300],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: 'cartesian-linearX-bandY',
  // 追加图层
  getLayersConfig: () => getLayersConfig('cartesian-linearX-bandY'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: 'text',
      type: 'text',
      name: '标题层',
      children: textLayer.children(),
      other: textLayer.other({
        content: '某 APP 活跃用户年龄分布',
      }),
    },
    {
      key: 'legend',
      type: 'legend',
      name: '图例层',
      children: legendLayer.children(),
      other: legendLayer.other(),
    },
    {
      key: 'rect',
      type: 'rect',
      name: '矩形层',
      axis: 'main', // minor
      children: rectLayer.children(),
      other: rectLayer.other({
        type: 'bar',
        mode: 'group',
        labelPositionMax: 'right-outer',
      }),
      dataConfig: [
        [
          {
            name: '矩形层-数值',
            type: ['string', 'number'],
            range: [1, Infinity],
            value: [
              {
                key: '人数',
                name: '人数',
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
      children: axisLayer.children(null, 'cartesian-linearX-bandY'),
      other: axisLayer.other(),
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
            key: '年龄段',
            name: '年龄段',
            type: 'string',
          },
        ],
      },
    ],
  },
  // 交互
  interaction: {},
})
