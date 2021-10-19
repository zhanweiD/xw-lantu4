import {cartesian, legend, rect, title} from '@waves4/configs'
import data from './data'

export const config = (k) => ({
  key: 'basicBar',
  name: k('basicBar'),
  data,
  dimension: {
    fields: [
      {
        name: 'xColumn',
        defaultValue: ['年龄段'],
      },
    ],
  },
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  // 矩形图层
  layers: [rect({k, column: ['人数'], type: 'bar', mode: 'group', labelPosition: ['left-outer', 'right-outer']})],
  // 标题面板
  title: title({k, content: '某APP活跃用户年龄分布'}),
  // 图例面板
  legend: legend({k}),
  // 直角坐标系坐标轴
  axis: cartesian({k, tickZero: true, type: 'linearX-bandY'}),
  other: {
    sections: [
      {
        name: 'layout',
        fields: [
          {
            name: 'areaOffset',
            defaultValue: [10, 10, 10, 10],
          },
        ],
      },
    ],
  },
})
