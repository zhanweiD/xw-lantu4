import hJSON from 'hjson'
const data = [
  ['1', '2', '3', '4', '5'],
  [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
  [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
  [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
  [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
  [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870],
]
const boxplotOption = {
  title: [
    {
      text: '基础盒须图',
      textStyle: {
        color: '#fff',
      },
    },
  ],
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'shadow',
    },
  },
  xAxis: {
    type: 'category',
    splitArea: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    splitArea: {
      show: false,
    },
  },
  series: [
    {
      name: 'boxplot',
      type: 'boxplot',
      datasetIndex: 1,
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
        defaultValue: hJSON.stringify(boxplotOption, {space: 2, quotes: 'strings', separator: true}),
      },
    ],
  }
}

export const config = (k) => ({
  key: 'echartsBoxplotBase',
  name: k('echartsBoxplotBase'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
