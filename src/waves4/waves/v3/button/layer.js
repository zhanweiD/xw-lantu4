export default () => {
  return {
    name: '按钮层',
    type: 'button', // 必要
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
          {
            name: 'borderRadius',
          },
          {
            name: 'content',
            defaultValue: '按钮1',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgba(0,119,255,1)',
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
