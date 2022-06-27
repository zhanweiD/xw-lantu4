import data from './data'
import layer from './layer'
import {title} from '@waves4/configs'
export const config = (k) => ({
  key: 'renju',
  name: k('renju'),
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
  title: title({k, content: '手机厂商市场份额'}),
  legend: false,
})
