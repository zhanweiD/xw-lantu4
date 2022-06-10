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
    ],
  }
}
