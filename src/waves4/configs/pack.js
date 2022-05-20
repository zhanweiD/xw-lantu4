export default () => {
  return {
    name: '打包图',
    type: 'pack',
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
