export default () => {
  return {
    name: '树形图',
    type: 'tree',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'direction',
            defaultValue: 'horizontal',
          },
        ],
      },
      {
        name: 'line',
        fields: [
          {
            name: 'lineWidth',
            defaultValue: 3,
          },
          {
            name: 'opacity',
            defaultValue: 0.8,
          },
          {
            name: 'lineCurve',
            defaultValue: 'curveBumpX',
          },
          {
            name: 'sankeyAlign',
            defaultValue: 'middle',
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
          {
            name: 'labelOffset',
            defaultValue: 5,
          },
        ],
      },
    ],
  }
}
