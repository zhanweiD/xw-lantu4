import hJSON from 'hjson'
import {baseData} from '../data'

const funnelOption = {
  title: {
    text: '漏斗图',
    textStyle: {
      color: '#fff',
    },
  },
  series: [
    {
      name: 'Funnel',
      type: 'funnel',
      label: {
        color: 'rgba(255,255,255,0.5)',
      },
    },
  ],
}

const lineLayersss = () => {
  return {
    name: 'echartsoption',
    type: 'echartsoption',
    fields: [
      {
        name: 'echartsoption',
        defaultValue: hJSON.stringify(funnelOption, {space: 2, quotes: 'strings', separator: true}),
      },
    ],
  }
}

export const config = (k) => ({
  key: 'echartsFunnelBase',
  name: k('echartsFunnelBase'),
  data: baseData,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
