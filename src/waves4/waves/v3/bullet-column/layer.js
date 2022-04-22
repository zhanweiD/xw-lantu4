export default () => {
  return {
    name: '子弹柱状',
    type: 'bulletColumn', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'width',
            defaultValue: 20,
          },
          {
            name: 'lineWidth',
            defaultValue: 4,
          },
          {
            name: 'lineColor',
            defaultValue: 'RGBA(229, 100, 222, 0.65)',
          },
          {
            name: 'textSize',
            defaultValue: 12,
          },
          {
            name: 'singleColor',
            defaultValue: 'RGBA(255, 255, 255, 0.65)',
          },
        ],
      },
      {
        name: 'title',
        fields: [
          {
            name: 'show',
            defaultValue: true,
          },
          {
            name: 'content',
            defaultValue: '中等职业教育分布情况',
          },
          {
            name: 'textSize',
            defaultValue: 12,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
        ],
      },
      {
        name: 'legend',
        fields: [
          {
            name: 'show',
            defaultValue: true,
          },
          {
            name: 'textSize',
            defaultValue: 12,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
        ],
      },
      // {
      //   name: 'value',
      //   fields: [
      //     {
      //       name: 'valueSize',
      //       defaultValue: 12,
      //     },
      //     {
      //       name: 'valueColor',
      //       defaultValue: 'RGBA(255, 255, 255, 0.65)',
      //     },
      //   ],
      // },
      {
        name: 'unit',
        fields: [
          {name: 'show', defaultValue: false},
          {name: 'textSize', defaultValue: 12},
          {name: 'singleColor', defaultValue: 'rgba(255,255,255,0.5)'},
          {name: 'offset', defaultValue: [0, 48]},
          {name: 'content', defaultValue: '单位'},
        ],
      },
    ],
  }
}
