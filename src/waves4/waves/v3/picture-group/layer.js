export default () => {
  return {
    name: '图片组',
    type: 'picture',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'fontSize',
            defaultValue: 20,
          },
          {
            name: 'columnNumber',
            defaultValue: 3,
            step: 1,
          },
          {
            name: 'gap',
            defaultValue: 20,
            step: 1,
          },
          {
            name: 'labelColor',
            defaultValue: 'rgb(0,0,0)',
          },
        ],
      },
    ],
  }
}
