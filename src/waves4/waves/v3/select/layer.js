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
            defaultValue: 20,
          },
          {
            name: 'singleColor',
            defaultValue: 'rgba(255,255,255,1)',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgba(255,255,255,0.1)',
          },
          // 选项文字颜色
          {
            name: 'optionFontColor',
            defaultValue: 'rgba(255, 255, 255, 1)',
          },
          // 选项默认背景色
          {
            name: 'optionBackgroundColor',
            defaultValue: 'rgba(255, 255, 255, 0.3)',
          },
          // 选项的背景悬浮时颜色
          {
            name: 'optionHoverBackgroundColor',
            defaultValue: 'rgba(255, 255, 255, 0.4)',
          },
        ],
      },
    ],
  }
}
