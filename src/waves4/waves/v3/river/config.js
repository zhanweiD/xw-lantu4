// import {title, legend, cartesian, line} from '@waves4/configs'
import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'river',
  name: k('river'),
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
})
