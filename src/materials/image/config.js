export const config = (k) => ({
  key: 'image',
  name: k('image'),
  layout: () => [10, 10], // 拖拽image生成容器组件
  // layout: () => [5, 5],
  layers: [
    {
      type: 'image',
      name: '',
      fields: [
        {
          name: 'fillMode',
        },
        {
          name: 'opacity',
        },
        {
          name: 'blendMode',
        },
      ],
    },
  ],
})
