import hJSON from 'hjson'

const data = [
  ['北京', '上海'],
  [10, 8.04],
  [8.07, 6.95],
  [13, 7.58],
  [9.05, 8.81],
  [11, 8.33],
  [14, 7.66],
  [13.4, 6.81],
  [10, 6.33],
  [14, 8.96],
  [12.5, 6.82],
  [9.15, 7.2],
  [11.5, 7.2],
  [3.03, 4.23],
  [12.2, 7.83],
  [2.02, 4.47],
  [1.05, 3.33],
  [4.05, 4.96],
  [6.03, 7.24],
  [12, 6.26],
  [12, 8.84],
  [7.08, 5.82],
  [5.02, 5.68],
]

const scatterOption = {
  title: {
    text: '点图',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {},
  yAxis: {},
  series: [
    {
      symbolSize: 20,
      type: 'scatter',
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
  key: 'echartsBaseScatter',
  name: k('echartsBaseScatter'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
