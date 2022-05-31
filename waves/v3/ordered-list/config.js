import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'orderedList',
  name: k('orderedList'),
  layout: () => [10, 6],
  padding: [10, 10, 10, 10],
  layers: [
    layer({
      k,
      column: ['地区'],
    }),
  ],
  data,
  axis: false,
  legend: false,
})
