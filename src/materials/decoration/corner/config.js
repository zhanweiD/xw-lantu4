export const config = (k) => ({
  key: 'corner',
  name: k('corner'),
  layout: () => [5, 5],
  layers: [
    {
      type: 'borderA',
      name: 'corner',
      sections: [
        {
          name: 'base',
          fields: [
            {
              name: 'size',
              defaultValue: 10,
            },
            {
              name: 'lineWidth',
              defaultValue: 2,
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
    },
  ],
})
