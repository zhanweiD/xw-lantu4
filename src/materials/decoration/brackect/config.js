export const config = (k) => ({
  key: 'brackect',
  name: k('brackect'),
  layout: () => [5, 5],
  layers: [
    {
      type: 'borderA',
      name: 'brackect',
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