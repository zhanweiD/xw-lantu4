import {getLayersConfig, textLayer, rectLayer, legendLayer, axisLayer} from '@waves4/configs'
import {contourDensity} from 'd3'
import data from './data'

const lineLayer = (k) => ({
  name: '线层',

  // 第二层sections
  sections: [
    {
      name: 'line',
      // 是否有数据字段映射
      hasColumn: true,
      fields: [
        {
          // 曲线类型
          name: 'lineCurve',
          // 可以自定义option
          option: 'lineStyle',
        },
      ],
    },
    {
      name: 'point',
      // 如果有effective属性，且值为布尔，则该section可以整体切换是否生效
      effective: true,
      fields: [
        {
          // 通用图形尺寸
          name: 'size',
          defaultValue: 10,
        },
      ],
      sections: [
        {
          name: 'fill',
          fields: [
            {
              name: 'color',

              defaultValue: 'pink',
            },
          ],
        },
        {
          name: 'stroke',
          fields: [
            {
              name: 'color',
              defaultValue: 'blue',
            },
            {
              name: 'strokeWeight',
              defaultValue: 2,
            },
          ],
        },
      ],
    },
    {
      name: 'label',
      effective: true,
      sections: [
        {
          name: 'text',
          fields: [
            {
              name: 'potision',
            },
            {
              name: 'offset',
            },
            {
              name: 'color',
            },
            {
              name: 'opacity',
            },
            {
              name: 'textSize',
            },
            {
              name: 'textWeight',
            },
          ],
        },
        {
          name: 'shadow',
          fields: [
            {
              name: 'color',
            },
            {
              name: 'opacity',
            },
            {
              name: 'offset',
            },
          ],
        },
        {
          name: 'format',
          fields: [
            {
              name: 'thousandDiv',
              defaultValue: false,
            },
            {
              name: 'percentage',
              defaultValue: false,
            },
            {
              name: 'decimalPlaces',
              defaultValue: 2,
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
  data: {
    type: 'normal',
    json: [
      ['city', 'count', {name: 'city', tip: 'City Name'}],
      ['beijing', 2000],
    ],
    demension: ['city'],
  },
  layers: [lineLayer(k)],
})
