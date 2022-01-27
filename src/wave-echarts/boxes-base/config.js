import hJSON from 'hjson'
const data = [
  ['2017-10-24', 20, 34, 10, 38],
  ['2017-10-25', 40, 35, 30, 50],
  ['2017-10-26', 31, 38, 33, 44],
  ['2017-10-27', 38, 15, 5, 42],
]

const scatterOption = {
  title: {
    text: 'K线图',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {},
  series: [
    {
      type: 'candlestick',
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
        defaultValue: hJSON.stringify(scatterOption, {space: 2, quotes: 'strings', separator: true}),
      },
    ],
  }
}

export const config = (k) => ({
  key: 'echartsBoxesBase',
  name: k('echartsBoxesBase'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
