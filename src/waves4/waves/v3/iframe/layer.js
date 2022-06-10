export default () => {
  return {
    name: '内联框架',
    type: 'iframe',
    sections: [
      {
        name: 'base',
        fields: [
          {
            name: 'isMarkVisible',
            defaultValue: false,
          },
          {
            name: 'borderWidth',
            defaultValue: 0,
            min: 0,
            max: 1,
          },
          {
            name: 'borderColor',
            defaultValue: '#000',
          },
          {
            name: 'scrolling',
            defaultValue: false,
          },
          {
            name: 'isCustomSize',
            defaultValue: false,
          },
          // 自定义宽高
          {
            name: 'width',
            defaultValue: 400,
          },
          {
            name: 'height',
            defaultValue: 300,
          },
        ],
      },
    ],
  }
}
