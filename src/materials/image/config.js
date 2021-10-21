export const config = (k) => ({
  key: 'image',
  name: k('image'),
  layout: () => [5, 5],
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
