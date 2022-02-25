export default () => {
  return {
    name: '打包图',
    type: 'pack',
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
