export const config = (k) => ({
  key: 'dot',
  name: k('dot'),
  layout: () => [5, 5],
  layers: [
    {
      type: 'borderA',
      name: 'dot',
      fields: [
        {
          name: 'sizeSpecialDotMaterial',
          defaultValue: 5,
        },
        {
          name: 'singleColor',
          defaultValue: '#09f',
        },
        {
          name: 'opacity',
          defaultValue: 1,
        },
      ],
    },
  ],
})
