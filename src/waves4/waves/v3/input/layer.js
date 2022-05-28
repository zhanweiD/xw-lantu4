export default () => {
  return {
    name: '输入框层',
    type: 'input',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'singleColor',
            defaultValue: 'rgb(0,0,0)',
          },
          {
            name: 'placeholder',
            defaultValue: '请输入内容',
          },
          {
            name: 'content',
            defaultValue: '',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'radius',
            defaultValue: 10,
          },
          {
            name: 'borderColor',
            defaultValue: 'rgb(171,171,171)',
          },
          {
            name: 'borderWidth',
            defaultValue: 1,
          },
          {
            name: 'isDisabled',
            defaultValue: false,
          },
          {
            name: 'maxLength',
            defaultValue: 10,
          },
        ],
      },
    ],
  }
}
