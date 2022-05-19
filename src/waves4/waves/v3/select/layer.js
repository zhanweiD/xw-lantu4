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
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(0,119,255)',
          },
          // 选项文字颜色
          {
            name: 'optionFontColor',
            defaultValue: '#000',
          },
          // 选项默认背景色
          {
            name: 'optionBackgroundColor',
            defaultValue: 'rgb(255,255,255)',
          },
          // 选项的背景悬浮时颜色
          {
            name: 'optionHoverBackgroundColor',
            defaultValue: 'rgb(83,90,138)',
          },
        ],
      },
    ],
  }
}
