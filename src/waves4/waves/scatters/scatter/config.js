import {getLayersConfig, textLayer, scatterLayer, axisLayer} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'scatter',
  name: k('scatter'),
  // 图表容器初始化的大小
  layout: () => [500, 300],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: 'cartesian-linearX-linearY',
  // 追加图层
  getLayersConfig: () => getLayersConfig('cartesian-linearX-linearY'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: 'text',
      type: 'text',
      name: '标题层',
      children: textLayer.children(),
      other: textLayer.other({
        content: '传染病的传播力和致死率分布',
      }),
    },
    {
      key: 'scatter',
      type: 'scatter',
      name: '散点层',
      axis: 'main', // minor
      children: scatterLayer.children(),
      other: scatterLayer.other(),
      dataConfig: [
        [
          {
            name: '散点层-类别',
            type: ['string'],
            range: [1, 1],
            value: [
              {
                key: '疾病',
                name: '疾病',
                type: 'string',
              },
            ],
          },
          {
            name: '散点层-x',
            type: ['number'],
            range: [1, 1],
            value: [
              {
                key: '传播力',
                name: '传播力',
                type: 'number',
              },
            ],
          },
          {
            name: '散点层-y',
            type: ['number'],
            range: [1, 1],
            value: [
              {
                key: '致死率',
                name: '致死率',
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
      children: axisLayer.children(null, 'cartesian-linearX-linearY'),
      other: axisLayer.other(),
    },
  ],
  // 数据
  data: {
    type: 'json',
    json: data,
  },
  // 交互
  interaction: {},
})
