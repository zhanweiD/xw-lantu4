import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'semicircle',
  name: k('semicircle'),
  layout: () => [10, 6],
  padding: [24, 24, 24, 24],
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
  axis: true,
  legend: false,
})
