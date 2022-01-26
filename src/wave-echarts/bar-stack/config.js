import hJSON from 'hjson'
import {stackBarOption} from '../default-option'
import {groupData} from '../data'

const lineLayersss = () => {
  return {
    name: 'echartsoption',
    type: 'echartsoption',
    fields: [
      {
        name: 'echartsoption',
        defaultValue: hJSON.stringify(stackBarOption, {space: 2, quotes: 'strings', separator: true}),
      },
    ],
  }
}

export const config = (k) => ({
  key: 'echertsStackBar',
  name: k('echertsStackBar'),
  data: groupData,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
