// import {title, legend, cartesian, line} from '@waves4/configs'
import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'river',
  name: k('river'),
  layout: () => [10, 6],
  padding: [60, 0, 60, 60],
  layers: [
    layer({
      k,
      column: ['地区'],
    }),
  ],
  data,
})
