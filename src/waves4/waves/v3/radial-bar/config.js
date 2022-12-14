import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'radialBar',
  name: k('radialBar'),
  layout: () => [10, 10],
  padding: [10, 10, 10, 10],
  layers: [layer()],
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['地区'],
      },
    ],
  },
  data,
  axis: false,
  legend: false,
})
