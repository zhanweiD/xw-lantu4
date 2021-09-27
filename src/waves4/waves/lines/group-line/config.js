import {getLayersConfig, textLayer, lineLayer, legendLayer, axisLayer} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'groupLine',
  name: k('groupLine'),
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
        content: '2017年国内不同产业GDP增加值季度累计同比增长趋势',
      }),
    },
    {
      key: 'legend',
      type: 'legend',
      name: '图例层',
      children: legendLayer.children(),
      other: legendLayer.other({
        alignment: 'center-bottom',
      }),
    },
    {
      key: 'line',
      type: 'line',
      name: '折线层',
      axis: 'main', // minor
      children: lineLayer.children(),
      other: lineLayer.other({
        mode: 'default',
      }),
      dataConfig: [
        [
          {
            name: '折线层-数值',
            type: ['string', 'number'],
            range: [1, Infinity],
            value: [
              {
                key: '第一产业（%）',
                name: '第一产业（%）',
                type: 'number',
              },
              {
                key: '第二产业（%）',
                name: '第二产业（%）',
                type: 'number',
              },
              {
                key: '第三产业（%）',
                name: '第三产业（%）',
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
      other: axisLayer.other(),
    },
  ],
  // 数据
  data: {
    type: 'json',
    json: data,
    dimension: [
      {
        name: '折线层-维度',
        type: ['string'],
        range: [1, 1],
        value: [
          {
            key: '统计时间',
            name: '统计时间',
            type: 'string',
          },
        ],
      },
    ],
  },
  // 交互
  interaction: {},
})
