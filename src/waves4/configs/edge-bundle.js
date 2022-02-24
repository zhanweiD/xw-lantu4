export default () => {
  return {
    name: '边缘捆图',
    type: 'edgeBundle',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'circleSize',
            defaultValue: [5, 20],
          },
          {
            name: 'lineWidth',
            defaultValue: 1,
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
      // {
      //   name: 'pack',
      //   fields: [
      //     {
      //       name: 'circle',
      //       sections: [
      //         {
      //           name: 'singleColor',
      //           defaultValue: 'rgb(255,255,255)',
      //         },
      //       ]
      //     },
      //   ],
      // },
    ],
  }
}
