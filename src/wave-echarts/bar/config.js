import hJSON from 'hjson'
const lineLayersss = () => {
  return {
    name: 'echartsoption',
    type: 'echartsoption',
    fields: [
      {
        name: 'echartsoption',
        defaultValue: hJSON.stringify(
          {
            xAxis: {
              type: 'category',
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                type: 'line',
              },
            ],
          },
          {space: 2, quotes: 'strings', separator: true}
        ),
      },
    ],
  }
}

export const config = (k, data) => ({
  key: 'echertsBasicBar',
  name: k('echertsBasicBar'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
