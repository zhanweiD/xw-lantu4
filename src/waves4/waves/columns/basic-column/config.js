import {getLayersConfig, textLayer, rectLayer, legendLayer, axisLayer} from '@waves4/configs'
import data from './data'

const pointLayer = (k) => ({
  name: '散点气泡层',
  type: 'pointLayer',
  // 第二层sections
  sections: [
    {
      name: 'line',
    },
    {
      name: 'point',
    },
    {
      name: 'label',
      // 如果有effective属性，且值为布尔，则该section可以整体切换是否生效
      effective: false,
      sections: [
        {
          name: 'text',
        },
        {
          name: 'shadow',
        },
        {
          name: 'format',
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
  // 下面的xPanel面板，工具内部是有固定顺序的
  titlePanel: true,
  lengedPanel: {
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
  // 坐标轴
  axisPanel: true,
  // 极坐标系坐标轴
  polarPanel: false,
  // 动画
  animationPanel: false,
  // 高级
  advancePanel: false,
})
