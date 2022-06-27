/*
 * @Author: zhanwei
 * @Date: 2022-06-19 15:24:22
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-06-27 16:58:54
 * @Description:
 */
import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'bulletColumn',
  name: k('bulletColumn'),
  layout: () => [10, 6],
  padding: [24, 24, 24, 24],
  layers: [layer()],
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['label'],
      },
    ],
  },
  data,
  axis: false,
  legend: false,
})
