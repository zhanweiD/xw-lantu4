import hJSON from 'hjson'

const data = [
  ['name', 'value', 'id', 'parentId'],
  ['flare', null, 1, 0],
  ['analytics', null, 2, 1],
  ['cluster', null, 3, 2],
  ['AgglomerativeCluster', 3938, 4, 3],
  ['CommunityStructure', 3812, 5, 3],
  ['graph', null, 6, 2],
  ['BetweennessCentrality', 3534, 7, 3],
  ['LinkDistance', 5731, 8, 3],
  ['optimization', null, 9, 2],
  ['AspectRatioBanker', 7074, 10, 3],
  ['animate', null, 11, 1],
  ['Easing', 17010, 12, 11],
  ['FunctionSequence', 5842, 13, 11],
  ['data', null, 14, 1],
  ['DataField', 1759, 15, 14],
  ['DataSchema', 2165, 16, 14],
  ['display', null, 17, 1],
  ['DirtySprite', 8833, 18, 17],
  ['LineSprite', 1732, 19, 17],
  ['flex', null, 20, 1],
  ['FlareVis', 4116, 21, 20],
]
const treemapOption = {
  title: [
    {
      text: '基础矩形树图',
      textStyle: {
        color: '#fff',
      },
    },
  ],
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
  },
  series: [
    {
      type: 'treemap',
      // data: [data],
      top: '1%',
      left: '7%',
      bottom: '1%',
      right: '20%',
      symbolSize: 7,
      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
        fontSize: 9,
      },
      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
        },
      },
      emphasis: {
        focus: 'descendant',
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
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
        defaultValue: hJSON.stringify(treemapOption, {space: 2, quotes: 'strings', separator: true}),
      },
    ],
  }
}

export const config = (k) => ({
  key: 'echartsTreemapBase',
  name: k('echartsTreemapBase'),
  data,
  // 图表容器初始化的大小
  layout: () => [10, 6],
  // 图表主绘图区域的内边距
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
