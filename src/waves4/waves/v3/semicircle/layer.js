export default () => {
  return {
    name: '玄月',
    type: 'semicircle', // 必要
    sections: [
      {
        name: 'dataMap',
        fields: [
          {
            name: 'column',
            defaultValue: ['女生人数', '总人数'],
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
            defaultValue: 20,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
        ],
      },
      {
        name: 'axis',
        fields: [
          {
            name: 'textSize',
            defaultValue: 12,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'labelOffset',
            defaultValue: 0,
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
      {
        name: 'arc',
        fields: [
          {
            name: 'valueVisible',
            defaultValue: true,
          },
          {
            name: 'valueSize',
            defaultValue: 12,
          },
          {
            name: 'valueColor',
            defaultValue: 'RGBA(255, 255, 255, 0.65)',
          },
          {
            name: 'arcLineColor',
            defaultValue: 'RGBA(255, 255, 255, 0.65)',
          },
          {
            name: 'orderType',
            defaultValue: 'DEFAULT',
          },
          {
            name: 'decimalNumber',
            defaultValue: 2,
          },
        ],
        sections: [
          {
            name: 'color',
            effective: false,
            fields: [
              {
                name: 'colorType2',
                defaultValue: 'customColors',
              },
              {
                name: 'singleColor',
                defaultValue: 'rgba(52,200,254,1)',
              },
              {
                name: 'rangeColors',
                effective: false,
              },
            ],
          },
        ],
      },
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
