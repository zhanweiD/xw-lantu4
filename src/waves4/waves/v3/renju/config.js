/*
 * @Author: zhanwei
 * @Date: 2022-06-19 15:24:22
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-06-27 18:38:49
 * @Description:
 */
import data from './data'
import layer from './layer'
import {title} from '@waves4/configs'
export const config = (k) => ({
  key: 'renju',
  name: k('renju'),
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
  axis: false,
  title: title({k, content: '手机厂商市场份额'}),
  legend: false,
})
