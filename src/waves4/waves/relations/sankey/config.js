import {getLayersConfig, textLayer, sankeyLayer} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'sankey',
  name: k('sankey'),
  // 图表容器初始化的大小
  layout: () => [600, 400],
  // 图表主绘图区域的内边距
  padding: [60, 0, 10, 0],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: 'polar',
  // 追加图层
  getLayersConfig: () => getLayersConfig('polar'),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: 'text',
      type: 'text',
      name: '标题层',
      children: textLayer.children(),
      other: textLayer.other({
        content: '生态环境部2019年部门预算',
      }),
    },
    {
      key: 'sankey',
      type: 'sankey',
      name: '桑基图层',
      children: sankeyLayer.children(),
      other: sankeyLayer.other(),
      dataConfig: [
        [
          {
            name: '节点ID',
            type: ['string'],
            range: [1, 1],
            value: [
              {
                key: 'id',
                name: 'id',
                type: 'string',
              },
            ],
          },
          {
            name: '节点名称',
            type: ['string'],
            range: [1, 1],
            value: [
              {
                key: 'name',
                name: 'name',
                type: 'string',
              },
            ],
          },
        ],
        [
          {
            name: '边开始',
            type: ['string'],
            range: [1, 1],
            value: [
              {
                key: 'from',
                name: 'from',
                type: 'string',
              },
            ],
          },
          {
            name: '边结束',
            type: ['string'],
            range: [1, 1],
            value: [
              {
                key: 'to',
                name: 'to',
                type: 'string',
              },
            ],
          },
          {
            name: '边数值',
            type: ['number'],
            range: [1, 1],
            value: [
              {
                key: 'value',
                name: 'value',
                type: 'number',
              },
            ],
          },
        ],
      ],
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
