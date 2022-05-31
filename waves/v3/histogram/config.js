import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'histogram',
  name: k('histogram'),
  layout: () => [10, 6],
  padding: [60, 0, 60, 60],
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
