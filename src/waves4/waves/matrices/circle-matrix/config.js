import {getLayersConfig, textLayer, matrixLayer, axisLayer} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'circleMatrix',
  name: k('circleMatrix'),
  // 图表容器初始化的大小
  layout: () => [600, 600],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: 'cartesian-bandX-bandY',
  // 追加图层
  getLayersConfig: () => getLayersConfig('cartesian-bandX-bandY'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: 'text',
      type: 'text',
      name: '标题层',
      children: textLayer.children(),
      other: textLayer.other({
        content: '2009-2020年杭州市各月份平均温度',
      }),
    },
    {
      key: 'matrix',
      type: 'matrix',
      name: '矩阵层',
      axis: 'main', // minor
      children: matrixLayer.children(),
      other: matrixLayer.other({
        shape: 'circle',
      }),
      dataConfig: [
        [
          {
            name: '矩阵层-数值',
            type: ['string', 'number'],
            range: [1, 1],
            value: [
              {
                key: '平均温度',
                name: '平均温度',
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
        paddingInner: 0.01,
      }),
    },
  ],
  // 数据
  data: {
    type: 'json',
    json: data,
    dimension: [
      {
        name: '矩阵层-维度',
        type: ['string'],
        range: [2, 2],
        value: [
          {
            key: '年份',
            name: '年份',
            type: 'string',
          },
          {
            key: '月份',
            name: '月份',
            type: 'string',
          },
        ],
      },
    ],
  },
  // 交互
  interaction: {},
})
