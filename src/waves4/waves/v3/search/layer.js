export default () => {
  return {
    name: '搜索框层',
    type: 'search',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'placeholder',
            defaultValue: '请输入关键字搜索',
          },
          {
            name: 'content',
            defaultValue: '',
          },
          // 输入内容颜色
          {
            name: 'singleColor',
            defaultValue: 'rgba(255,255,255)',
          },
          // 搜索Icon颜色
          {
            name: 'searchIconColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(0,0,0)',
          },
          {
            name: 'iconBackgroundColor',
            defaultValue: 'rgb(0,0,0)',
          },
          {
            name: 'radius',
            defaultValue: 10,
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
