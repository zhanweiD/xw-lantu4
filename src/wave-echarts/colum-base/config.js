import hJSON from 'hjson'
import {baseColumnOption} from '../default-option'
import {baseData} from '../data'

const lineLayersss = () => {
  return {
    name: 'echartsoption',
    type: 'echartsoption',
    fields: [
      {
        name: 'echartsoption',
        defaultValue: hJSON.stringify(baseColumnOption, {space: 2, quotes: 'strings', separator: true}),
      },
    ],
  }
}

export const config = (k) => ({
  key: 'echertsBasicColumn',
  name: k('echertsBasicColumn'),
  data: baseData,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
