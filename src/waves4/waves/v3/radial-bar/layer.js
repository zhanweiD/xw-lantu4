export default () => {
  return {
    name: '玉珏图',
    type: 'radialBar', // 必要
    sections: [
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
        name: 'arc',
        fields: [
          {
            name: 'arcWidth',
            defaultValue: 0,
          },
          {
            name: 'minRadius',
            defaultValue: 50,
          },
          {
            name: 'arcGap',
            defaultValue: 10,
          },
          {
            name: 'order',
            defaultValue: 'POSITIVE',
          },
          {
            name: 'arcBackgroundWidth',
            defaultValue: 0,
          },
          {
            name: 'arcBackgroundColor',
            defaultValue: 'rgba(255,255,255,0.15)',
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
