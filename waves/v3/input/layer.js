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
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'placeholder',
            defaultValue: '请输入',
          },
          {
            name: 'content',
            defaultValue: '',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(0,0,0)',
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
            defaultValue: 3,
          },
          {
            name: 'isDisplayTextNum',
            defaultValue: true,
          },
          {
            name: 'isDisabled',
            defaultValue: false,
          },
          {
            name: 'maxLength',
            defaultValue: 30,
          },
        ],
      },
    ],
  }
}
