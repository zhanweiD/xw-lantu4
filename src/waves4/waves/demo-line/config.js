import {getLayersConfig, textLayer, rectLayer, legendLayer, axisLayer} from '@waves4/configs'
import data from './data'

const dimension = (k) => ({
  name: '维度',
  type: 'dimension',
  fields: [
    {
      name: 'xAxisDimension',
      defaultValue: ['成员名称'],
      range: [1, 1],
    },
  ],
})

const lineLayer = (k) => ({
  name: '线层',
  type: 'line',
  sections: [
    {
      name: 'data',
      fields: [
        {
          name: 'column',
          defaultValue: ['项目交付'],
        },
      ],
    },
    {
      name: 'line',
      fields: [
        {
          name: 'lineWidth',
          defaultValue: 4,
        },
        {
          name: 'lineSmooth',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'point',
      fields: [
        {
          name: 'size',
          defaultValue: 8,
        },
      ],
    },
    // 下面area打开会报错
    // {
    //   name: 'area',
    // },
    {
      name: 'label',
      // 如果有effective属性，且值为布尔，则该section可以整体切换是否生效
      effective: false,
      sections: [
        {
          name: 'text',
          fields: [
            {
              name: 'textSize',
              defaultValue: 15,
            },
          ],
        },
        {
          name: 'shadow',
          effective: false,
          fields: [
            {
              name: 'blur',
              defaultValue: 4,
            },
          ],
        },
      ],
    },
  ],
})

export const config = (k) => ({
  key: 'demo',
  name: k('line'),
  data,
  dimension: {
    fields: [
      {
        name: 'columnX',
        defaultValue: ['成员名称'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayer(k)],
  // 下面的面板，工具内部是有固定顺序的
  // 标题面板
  // title: [
  //   ['titleBase.content', 'xxx.yyy.title', 'GIS地图'],
  //   ['text.textSize', 'xxx.yyy.fontSize', 12],
  // ],

  // title: {
  //   sections: [
  //     {
  //       name: 'titleBase',
  //       fields: [
  //         {
  //           name: 'content',
  //           defaultValue: 'GIS地图',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // // 图例面板
  // lenged: {
  //   sections: [
  //     {
  //       name: 'base',
  //       fields: [
  //         {
  //           name: 'size',
  //         },
  //         {
  //           name: 'position',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // // 直角坐标系坐标轴
  // axis: true,
  // // 极坐标系坐标轴
  // polarAxis: false,
  // // 动画
  // animation: false,
  // // 高级
  // advance: false,
})
