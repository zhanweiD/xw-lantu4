import hJSON from 'hjson'

const data = [
  ['id', 'name', 'size', 'source', 'target'],
  ['0', 'Myriel', 19],
  ['1', 'Napoleon', 4, '1', '0'],
  ['2', 'MlleBaptistine', 6, '2', '0'],
  ['3', 'MmeMagloire', 6, '3', '0'],
  ['3', 'MmeMagloire', 6, '3', '2'],
  ['4', 'CountessDeLo', 3, '4', '0'],
  ['5', 'Geborand', 3, '5', '0'],
  ['6', 'Champtercier', 3, '6', '0'],
  ['7', 'Cravatte', 2, '7', '0'],
  ['8', 'Count', 2, '8', '0'],
  ['9', 'OldMan', 2.3, '9', '0'],
  ['10', 'Labarre', 2.3],
  ['11', 'Valjean', 12, '11', '0'],
  ['11', 'Valjean', 12, '11', '2'],
  ['11', 'Valjean', 12, '11', '3'],
  ['11', 'Valjean', 12, '11', '10'],
  ['11', 'Valjean', 12, '11', '2'],
]
const graphOption = {
  title: [
    {
      text: '关系图',
      textStyle: {
        color: '#fff',
      },
    },
  ],
  series: [
    {
      type: 'graph',
      layout: 'force',
      // data: graph.nodes,
      // links: graph.links,
      roam: true,
      label: {
        position: 'right',
      },
      force: {
        repulsion: 100,
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
        defaultValue: hJSON.stringify(graphOption, {space: 2, quotes: 'strings', separator: true}),
      },
    ],
  }
}

export const config = (k) => ({
  key: 'echartsGraphBase',
  name: k('echartsGraphBase'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
