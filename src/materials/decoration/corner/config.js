export const config = (k) => ({
  key: 'corner',
  name: k('corner'),
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 折线图层
  layers: [
    {
      name: 'corner',
      fields: [
        {
          name: 'textSize',
          defaultValue: 20,
        },
        {
          name: 'textWeight',
          defaultValue: 400,
        },
        {
          name: 'singleColor',
          defaultValue: 'rgb(255,255,255)',
        },
        {
          name: 'opacity',
          defaultValue: 1,
        },
      ],
    },
  ],
})
