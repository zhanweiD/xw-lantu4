export const config = (k) => ({
  key: 'corner',
  name: k('corner'),
  layout: () => [5, 5],
  layers: [
    {
      type: 'borderA',
      name: 'corner',
      fields: [
        {
          name: 'custom',
          option: 'mode',
          label: 'mode',
          defaultValue: 'knuckle',
          type: 'select',
          options: [
            {
              key: 'knuckle',
              value: 'knuckle',
            },
          ],
        },
        {
          name: 'size',
          defaultValue: 20,
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
})
