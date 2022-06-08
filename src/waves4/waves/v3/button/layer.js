export default () => {
  return {
    name: '按钮层',
    type: 'button', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'borderRadius',
          },
          {
            name: 'content',
            defaultValue: '按钮',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(0,0,0)',
          },
          {
            name: 'borderWidth',
          },
          {
            name: 'borderColor',
          },
        ],
      },
    ],
  }
}
