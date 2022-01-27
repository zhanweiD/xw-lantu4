import hJSON from 'hjson'

const data = [
  ['省份', '本科院校', '高职院校'],
  ['北京', 66, 25],
  ['天津', 30, 25],
  ['河北', 61, 59],
  ['山西', 33, 47],
  ['内蒙古', 17, 36],
  ['辽宁', 65, 51],
]

const funnelOption = {
  title: {
    text: '雷达图',
    textStyle: {
      color: '#fff',
    },
  },
  series: [
    {
      type: 'radar',
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
  key: 'echartsRadarGroup',
  name: k('echartsRadarGroup'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
