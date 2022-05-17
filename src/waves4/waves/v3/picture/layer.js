export default () => {
  return {
    name: '图片层',
    type: 'picture', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'borderRadius',
          },
          {
            name: 'content',
            defaultValue: '图片',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(0,119,255)',
          },
          {
            name: 'borderWidth',
          },
          {
            name: 'borderColor',
          },
          {
            name: 'opacity',
          },
          {
            name: 'padding',
          },
        ],
      },
    ],
  }
}
