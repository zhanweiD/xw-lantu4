export default () => {
  return {
    name: '河流层',
    type: 'river', // 必要
    sections: [
      {
        name: 'dataMap',
        fields: [
          {
            name: 'column',
            defaultValue: ['食品', '交通', '教育', '住房', '购物'],
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
        name: 'unit',
        fields: [
          {name: 'show', defaultValue: false},
          {name: 'textSize', defaultValue: 12},
          {name: 'singleColor', defaultValue: 'rgba(255,255,255,0.5)'},
          {name: 'offset', defaultValue: [0, 48]},
          {name: 'content', defaultValue: '单位'},
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
    ],
  }
}
