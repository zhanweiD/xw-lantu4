const lineLayersss = () => {
  return {
    name: 'echartsConfigOption',
    type: 'line',
    fields: [
      {
        name: 'echartsConfigOption',
      },
    ],
  }
}

export const config = (k, data) => ({
  key: 'echertsBasicBar',
  name: k('echertsBasicBar'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['年龄段'],
      },
    ],
  },
  echartsConfigOption: {
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'textSize',
            defaultValue: 16,
          },
        ],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
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
})
