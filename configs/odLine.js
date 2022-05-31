export default () => {
  return {
    name: '飞线层',
    type: 'odLine',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'singleColor',
            defaultValue: 'yellow',
          },
        ],
      },
      {
        name: 'line',
        fields: [
          {
            name: 'singleColor',
            defaultValue: 'yellow',
          },
          {
            name: 'lineWidth',
            defaultValue: 2,
          },
          // {
          //   name: 'opacity',
          //   defaultValue: 1,
          // },
        ],
      },
    ],
  }
}
