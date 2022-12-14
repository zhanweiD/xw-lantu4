export const config = (k) => ({
  key: 'brackect',
  name: k('brackect'),
  layout: () => [5, 5],
  layers: [
    {
      type: 'borderA',
      name: 'brackect',
      fields: [
        {
          name: 'custom',
          option: 'mode',
          label: 'mode',
          defaultValue: 'bracket',
          type: 'select',
          options: [
            {
              key: 'bracket',
              value: 'bracket',
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
