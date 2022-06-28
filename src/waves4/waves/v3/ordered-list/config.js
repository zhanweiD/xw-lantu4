/*
 * @Author: zhanwei
 * @Date: 2022-06-19 15:24:22
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-06-27 17:55:34
 * @Description:
 */
import data from './data'
import layer from './layer'

export const config = (k) => ({
  key: 'orderedList',
  name: k('orderedList'),
  layout: () => [10, 6],
  padding: [10, 10, 10, 10],
  layers: [layer()],
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['年份'],
      },
    ],
  },
  data,
  axis: false,
  legend: false,
})
