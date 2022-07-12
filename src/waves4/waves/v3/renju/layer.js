export default () => {
  return {
    name: '连珠',
    type: 'renju', // 必要
    sections: [
      {
        name: 'dataMap',
        fields: [
          {
            name: 'column',
            defaultValue: ['数值'],
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
            name: 'labelAngle',
            defaultValue: 0,
          },
          {
            name: 'labelOffsetY',
            defaultValue: 0,
          },
        ],
      },
      {
        name: 'line',
        fields: [
          {
            name: 'lineOpacity',
            defaultValue: 0.4,
          },
          {
            name: 'lineColor',
            defaultValue: '#fff',
          },
        ],
      },
      {
        name: 'value',
        fields: [
          {
            name: 'valueSize',
            defaultValue: 12,
          },
          {
            name: 'valueColor',
            defaultValue: 'RGBA(255, 255, 255, 0.65)',
          },
          {
            name: 'valueType',
            defaultValue: 'SCALE',
          },
          {
            name: 'valueOffsetY',
            defaultValue: 0,
          },
        ],
      },
      {
        name: 'circle',
        fields: [
          {
            name: 'circleOpacity',
            defaultValue: 0.6,
          },
          {
            name: 'circleMaxRadius',
            defaultValue: 40,
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
