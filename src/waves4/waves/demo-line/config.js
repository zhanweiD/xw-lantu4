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
      name: 'dataMap',
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
        {
          name: 'colorType',
          // defaultValue: 'single',
        },
        {
          name: 'singleColor',
        },
        {
          name: 'gradientColor',
        },
        {
          name: 'themeColor',
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
        name: 'xColumn',
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
  title: {
    effective: true,
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'content',
            defaultValue: k('line'),
          },
        ],
      },
      {
        name: 'text',
        fields: [
          {
            name: 'textSize',
            defaultValue: 16,
          },
          {
            name: 'textWeight',
            defaultValue: 400,
          },
          {
            name: 'singleColor',
            defaultValue: '#ffffff',
          },
          {
            name: 'opacity',
            defaultValue: 1,
          },
          {
            name: 'offset',
            defaultValue: [0, 0],
          },
        ],
      },
      {
        name: 'shadow',
        effective: false,
        fields: [
          {
            name: 'singleColor',
          },
          {
            name: 'offset',
          },
        ],
      },
    ],
  },
  // 图例面板
  legend: {
    effective: true,
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'size',
          },
          {
            name: 'layoutPosition',
          },
          {
            name: 'offset',
          },
        ],
      },
    ],
  },
  // 直角坐标系坐标轴
  axis: {
    sections: [
      {
        name: 'xAxis',
        effective: true,
        sections: [
          {
            name: 'label',
            sections: [
              {
                name: 'text',
                fields: [
                  {
                    name: 'textSize',
                  },
                ],
              },
            ],
          },
          {
            name: 'xAxisLine',
            fields: [
              {
                name: 'singleColor',
                defaultValue: '#cccccc',
              },
            ],
          },
          {
            name: 'xAxisSplitLine',
            effective: true,
            fields: [
              {
                name: 'singleColor',
                defaultValue: '#cccccc',
              },
              {
                name: 'opacity',
                defaultValue: 0.3,
              },
            ],
          },
        ],
      },
      {
        name: 'yAxis',
        effective: true,
        sections: [
          {
            name: 'yAxisLine',
            fields: [
              {
                name: 'singleColor',
                defaultValue: '#cccccc',
              },
            ],
          },
          {
            name: 'yAxisSplitLine',
            effective: true,
            fields: [
              {
                name: 'singleColor',
                defaultValue: '#cccccc',
              },
              {
                name: 'opacity',
                defaultValue: 0.3,
              },
            ],
          },
        ],
      },
    ],
  },
  // // 极坐标系坐标轴
  // polarAxis: false,

  // 其他
  other: {
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'size',
          },

          {
            name: 'offset',
          },
        ],
      },
    ],
  },
})