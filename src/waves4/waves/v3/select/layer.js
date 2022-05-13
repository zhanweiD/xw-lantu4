export default () => {
  return {
    name: '下拉框图层',
    type: 'select', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'textSize',
            defaultValue: 24,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
          // {
          //   name: 'content',
          //   defaultValue: '下拉框',
          // },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(0,119,255)',
          },
        ],
      },
    ],
  }
}
