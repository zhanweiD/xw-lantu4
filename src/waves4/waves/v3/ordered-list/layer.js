export default () => {
  return {
    name: '排行榜',
    type: 'orderedList', // 必要
    sections: [
      {
        name: 'dataMap',
        fields: [
          {
            name: 'column',
            defaultValue: ['数量'],
          },
        ],
      },
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
        name: 'label',
        fields: [
          {
            name: 'labelSize',
            defaultValue: 12,
          },
          {
            name: 'labelColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)',
          },
          {
            name: 'valueVisible',
            defaultValue: true,
          },

          {
            name: 'labelOffsetY',
            defaultValue: 0,
          },
        ],
      },
      {
        name: 'value',
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
            name: 'singleColor',
            defaultValue: 'rgba(255, 255, 255, 0.65)',
          },
        ],
      },
      {
        name: 'options',
        fields: [
          {
            name: 'lineOffset',
            defaultValue: 60,
          },
          {
            name: 'lineHeight',
            defaultValue: 8,
          },
          {
            name: 'gradientDirection',
            defaultValue: 'HIRONZATAL',
          },
          {
            name: 'bgLineColor',
            defaultValue: 'RGBA(255,255,255,0.15)',
          },
          {
            name: 'gap',
            defaultValue: 0,
          },
          {
            name: 'maxRow',
            defaultValue: 8,
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
