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
            defaultValue: 'rgba(255,255,255,1)',
          },
          {
            name: 'content',
            defaultValue: '请输入内容',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgba(255,255,255,0.1)',
          },
        ],
      },
    ],
  }
}
