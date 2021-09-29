import {getLayersConfig, textLayer, chordLayer} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'chord',
  name: k('chord'),
  // 图表容器初始化的大小
  layout: () => [600, 600],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
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
        content: '欧洲各国人口流动情况',
      }),
    },
    {
      key: 'chord',
      type: 'chord',
      name: '和弦图层',
      children: chordLayer.children(),
      other: chordLayer.other(),
      dataConfig: [
        [
          {
            name: '节点ID',
            type: ['string', 'number'],
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
            type: ['string', 'number'],
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
            type: ['string', 'number'],
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
