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
        sections: [
          {
            name: 'color',
            effective: false,
            fields: [
              {
                name: 'singleColor',
                defaultValue: 'rgba(52,200,254,1)',
              },
            ],
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
      {
        name: 'tooltip',
        fields: [{name: 'show', defaultValue: false}],
      },
    ],
  }
}
