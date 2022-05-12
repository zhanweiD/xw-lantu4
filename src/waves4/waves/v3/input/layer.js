export default () => {
  return {
    name: '输入框层',
    type: 'input',
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
            name: 'content',
            defaultValue: '请输入内容',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(0,119,255)',
          },
        ],
      },
    ],
  }
}
