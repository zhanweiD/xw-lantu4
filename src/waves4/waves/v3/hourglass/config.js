import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'horizontalHourglass',
  name: k('horizontalHourglass'),
  layout: () => [10, 6],
  padding: [24, 24, 24, 24],
  layers: [layer()],
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['省份'],
      },
    ],
  },
  data,
  axis: false,
  legend: false,
})
