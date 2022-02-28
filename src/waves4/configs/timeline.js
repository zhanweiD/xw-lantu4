export default () => {
  return {
    name: '时间轴',
    type: 'timeline',
    sections: [
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
        name: 'background',
        fields: [
          {
            name: 'singleColor',
            defaultValue: 'rgba(255,255,255,0.2)',
          },
          // {
          //   name: 'borderRadius',
          //   defaultValue: 10,
          // },
        ],
      },
      {
        name: 'timeline',
        fields: [
          {
            name: 'circleSize',
            defaultValue: 10,
          },
          {
            name: 'singleColor',
            defaultValue: 'skyblue',
          },
        ],
      },
      {
        name: 'line',
        fields: [
          {
            name: 'lineWidth',
            defaultValue: 1,
          },
          {
            name: 'singleColor',
            defaultValue: 'skyblue',
          },
        ],
      },
    ],
  }
}
