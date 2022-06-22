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
        ],
      },
      {
        name: 'border',
        fields: [
          {
            name: 'borderWidth',
            defaultValue: 3,
          },
          {
            name: 'borderColor',
            defaultValue: 'rgb(90,153,243)',
          },
          {
            name: 'focusColor',
            defaultValue: 'rgb(0,127,212)',
          },
          {
            name: 'shadowColor',
            defaultValue: 'rgb(27 46 63)',
          },
          {
            name: 'shadowWidth',
            defaultValue: 6,
            max: 30,
            min: 0,
          },
          {
            name: 'shadowFuzziness',
            defaultValue: 0,
            max: 50,
            min: 0,
          },
        ],
      },
    ],
  }
}
