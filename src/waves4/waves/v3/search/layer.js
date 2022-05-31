export default () => {
  return {
    name: '搜索框层',
    type: 'search',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'textSize',
            defaultValue: 24,
          },
          // 输入内容颜色
          {
            name: 'singleColor',
            defaultValue: 'rgba(0,0,0,100)',
          },
          // 搜索Icon颜色
          {
            name: 'searchIconColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'placeholder',
            defaultValue: '请输入',
          },
          {
            name: 'backgroundColor',
            defaultValue: 'rgb(255,255,255)',
          },
          {
            name: 'iconBackgroundColor',
            defaultValue: 'rgb(88,138,238)',
          },
          {
            name: 'radius',
            defaultValue: 10,
          },
        ],
      },
    ],
  }
}
