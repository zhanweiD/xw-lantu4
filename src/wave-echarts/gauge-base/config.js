import hJSON from 'hjson'

const data = [
  ['name', 'value'],
  ['source', 50],
]

const gaugeOption = {
  title: [
    {
      text: '基础仪表盘',
      textStyle: {
        color: '#fff',
      },
    },
  ],
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
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
        defaultValue: hJSON.stringify(gaugeOption, {space: 2, quotes: 'strings', separator: true}),
      },
    ],
  }
}

export const config = (k) => ({
  key: 'echertsGaugeBase',
  name: k('echertsGaugeBase'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
