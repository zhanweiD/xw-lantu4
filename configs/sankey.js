export default () => {
  return {
    name: '桑基图',
    type: 'sankey',
    sections: [
      {
        name: 'color',
        effective: false,
        fields: [
          {
            name: 'colorType2',
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
        name: 'node',
        fields: [
          {
            name: 'nodeWidth',
            defaultValue: 10,
          },
          {
            name: 'nodeGap',
            defaultValue: 10,
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
          {
            name: 'align',
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
