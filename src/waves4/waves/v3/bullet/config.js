import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'bullet',
  name: k('bullet'),
  layout: () => [10, 6],
  padding: [60, 0, 60, 60],
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
