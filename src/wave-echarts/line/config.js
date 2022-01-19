const lineLayer = () => ({
  name: '线层',
  type: 'line',
  sections: [
    {
      name: 'dataMap',
      fields: [
        {
          name: 'column',
          defaultValue: ['人数'],
        },
      ],
    },
    {
      name: 'line',
      fields: [
        {
          name: 'lineWidth',
          defaultValue: 4,
          visible: false,
        },
        {
          name: 'custom',
          option: 'customOption',
          label: 'customLabel',
          defaultValue: '4',
          type: 'text',
        },
        {
          name: 'lineSmooth',
          defaultValue: false,
          action({value, siblings}) {
            console.log('lineSmooth', value, siblings)
            siblings.optionA.setEffective(value)
            siblings.lineWidth.setValue(9)
          },
        },
        {
          name: 'custom',
          option: 'optionA',
          effective: false,
          label: 'optionALabel',
          defaultValue: '4',
          type: 'text',
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

export const config = (k, data, key, name) => ({
  // key: 'echertsBasicLine',
  // name: 'echarts-折线图',
  key,
  name,
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['年龄段'],
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
            defaultValue: 'echart-line',
          },
          {
            name: 'layoutPosition',
            defaultValue: 'bottomCenter',
          },
          {
            name: 'offset',
            defaultValue: [0, 0],
          },
        ],
      },
      {
        name: 'text',
        fields: [
          // {
          //   name: 'custom',
          //   option: 'customOption',
          //   label: 'customLabel',
          //   defaultValue: '4',
          //   type: 'text',
          // },
          {
            name: 'textSize',
            defaultValue: 16,
          },
          {
            name: 'textWeight',
            defaultValue: 400,
          },
          // {
          //   name: 'colorType',
          //   defaultValue: 'singleColor',
          // },
          {
            name: 'singleColor',
            defaultValue: '#ffffff',
          },
          // {
          //   name: 'gradientColor',
          //   effective: false,
          //   defaultValue: [
          //     ['#79b7ff', 0],
          //     ['#007eff', 1],
          //   ],
          // },
          {
            name: 'opacity',
            defaultValue: 1,
          },
          // {
          //   name: 'offset',
          //   defaultValue: [0, 0],
          // },
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
            name: 'direction',
            defaultValue: 'vertical',
          },
          {
            name: 'offset',
            defaultValue: [0, 0],
          },
          {
            name: 'gap2',
            defaultValue: [2, 5],
          },
          {
            name: 'layoutPosition',
          },
        ],
      },
      // 图例图形
      {
        name: 'shape',
        fields: [
          {
            name: 'size',
            defaultValue: 10,
          },
          {
            name: 'opacity',
            defaultValue: 1,
          },
        ],
      },
      {
        name: 'label',
        sections: [
          // 图例文字大小
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
            ],
          },
          // 图例文字阴影
          {
            name: 'shadow',
            effective: true,
            fields: [
              {
                name: 'singleColor',
              },
              {
                name: 'offset',
              },
              {
                name: 'blur',
              },
            ],
          },
        ],
      },
    ],
  },
  // 直角坐标系坐标轴
  axis: {
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'tickZero',
          },
          {
            name: 'tickCount',
          },
          {
            name: 'paddingInner',
          },
        ],
      },
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
            name: 'axisLine',
            fields: [
              {
                name: 'singleColor',
                defaultValue: '#cccccc',
              },
            ],
          },
          {
            name: 'axisSplitLine',
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
})
