import {getLayersConfig, textLayer, rectLayer, legendLayer, axisLayer} from '@waves4/configs'
import data from './data'

const pointLayer = (k) => ({
  name: '散点气泡层',
  type: 'pointLayer',
  // 第二层sections
  sections: [
    {
      name: 'line',
      fields: [
        {
          name: 'column',
        },
      ],
    },
    {
      name: 'point',
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
      ],
    },
  ],
})

export const config = (k) => ({
  key: 'basicColumn',
  name: k('basicColumn'),
  // 图表容器初始化的大小
  layout: () => [500, 300],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  layers: [pointLayer(k)],
  // 下面的面板，工具内部是有固定顺序的
  // 标题面板
  title: [
    ['titleBase.content', 'xxx.yyy.title', 'GIS地图'],
    ['text.textSize', 'xxx.yyy.fontSize', 12],
  ],

  title: {
    sections: [
      {
        name: 'titleBase',
        fields: [
          {
            name: 'content',
            defaultValue: 'GIS地图',
          },
        ],
      },
    ],
  },
  // 图例面板
  legend: {
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'size',
          },
          {
            name: 'position',
          },
        ],
      },
    ],
  },
  // 直角坐标系坐标轴
  axis: true,
  // 极坐标系坐标轴
  polarAxis: false,
  // 动画
  animation: false,
  // 高级
  advance: false,
})
