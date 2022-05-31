export default () => {
  return {
    name: '下拉框图层',
    type: 'select', // 必要
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'radius',
            defaultValue: 10,
          },
          {
            name: 'placeholder',
            defaultValue: '请选择',
          },
          {
            name: 'singleColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'backgroundColor',
            defaultValue: '#000',
          },
          // 选项文字颜色
          {
            name: 'optionFontColor',
            defaultValue: 'rgb(255,255,255)',
          },
          // 选项默认背景色
          {
            name: 'optionBackgroundColor',
            defaultValue: 'rgb(22,34,54)',
          },
          // 选项的背景悬浮时颜色
          {
            name: 'optionHoverBackgroundColor',
            defaultValue: 'rgb(22,34,54)',
          },
          // 选项文字悬浮时颜色
          {
            name: 'optionHoverTextColor',
            defaultValue: 'rgb(84,159,248)',
          },
          // 支持搜索
          {
            name: 'supportSearch',
            defaultValue: true,
          },
        ],
      },
    ],
  }
}
