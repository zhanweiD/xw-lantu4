import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'progress',
  name: k('progress'),
  layout: () => [10, 6],
  padding: [10, 10, 10, 10],
  layers: [layer()],
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['名称'],
      },
    ],
  },
  data,
  axis: false,
  legend: false,
})
