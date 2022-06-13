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
            name: 'leftLabelColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'rightLabelColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(38,38,38)',
          },
        ],
      },
    ],
  }
}
