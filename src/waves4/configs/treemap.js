export default () => {
  return {
    name: '矩形树图',
    type: 'treemap',
    sections: [
      {
        name: 'color',
        effective: false,
        fields: [
          {
            name: 'colorList',
          },
        ],
      },
      {
        name: 'text',
        fields: [
          {
            name: 'textSize',
            defaultValue: 10,
          },
          {
            name: 'textWeight',
            defaultValue: 200,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'opacity',
            defaultValue: 1,
          },
        ],
      },
      {
        name: 'tooltip',
        fields: [{name: 'show', defaultValue: false}],
      },
    ],
  }
}
