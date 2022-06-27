import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'pyramid',
  name: k('pyramid'),
  layout: () => [10, 6],
  padding: [10, 10, 10, 10],
  layers: [layer()],
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['年份'],
      },
    ],
  },
  data,
  axis: false,
  legend: false,
})
