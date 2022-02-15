import hJSON from 'hjson'
// const data = [
//   [
//     []
//     {
//       id: "0",
//       name: "Myriel",
//       symbolSize: 19
//     },
//     {
//       id: "1",
//       name: "Napoleon",
//       symbolSize: 4,
//       value: 4
//     },
//     {
//       id: "2",
//       name: "MlleBaptistine",
//       symbolSize: 6,
//       value: 9.485714
//     },
//     {
//       id: "3",
//       name: "MmeMagloire",
//       symbolSize: 6,
//       value: 9.485714
//     },
//     {
//       id: "4",
//       name: "CountessDeLo",
//       symbolSize: 3,
//       value: 4
//     },
//     {
//       id: "5",
//       name: "Geborand",
//       symbolSize: 3,
//       value: 4
//     },
//     {
//       id: "6",
//       name: "Champtercier",
//       symbolSize: 3,
//       value: 4
//     },
//     {
//       id: "7",
//       name: "Cravatte",
//       symbolSize: 2.3,
//       value: 4
//     },
//     {
//       id: "8",
//       name: "Count",
//       symbolSize: 2.3,
//       value: 4
//     },
//     {
//       id: "9",
//       name: "OldMan",
//       symbolSize: 2.3,
//       value: 4
//     },
//     {
//       id: "10",
//       name: "Labarre",
//       symbolSize: 2.3,
//       value: 4
//     },
//     {
//       id: "11",
//       name: "Valjean",
//       symbolSize: 12,
//       value: 100
//     },
//     {
//       id: "12",
//       name: "Marguerite",
//       symbolSize: 5,
//       value: 6.742859
//     },
//     {
//       id: "13",
//       name: "MmeDeR",
//       symbolSize: 2.3,
//       value: 4,
//       category: 1
//     },
//     {
//       id: "14",
//       name: "Isabeau",
//       symbolSize: 2.3,
//       value: 4,
//       category: 1
//     },
//     {
//       id: "15",
//       name: "Gervais",
//       symbolSize: 2.3,
//       value: 4,
//       category: 1
//     },
//     {
//       id: "16",
//       name: "Tholomyes",
//       symbolSize: 17,
//       value: 25.942856,
//       category: 2
//     },
//     {
//       id: "17",
//       name: "Listolier",
//       symbolSize: 13,
//       value: 20.457146,
//       category: 2
//     },
//     {
//       id: "18",
//       name: "Fameuil",
//       symbolSize: 13,
//       value: 20.457146,
//       category: 2
//     },
//     {
//       id: "19",
//       name: "Blacheville",
//       symbolSize: 13,
//       value: 20.457146,
//       category: 2
//     },
//     {
//       id: "20",
//       name: "Favourite",
//       symbolSize: 13,
//       value: 20.457146,
//       category: 2
//     },
//     {
//       id: "21",
//       name: "Dahlia",
//       symbolSize: 13,
//       value: 20.457146,
//       category: 2
//     },
//     {
//       id: "22",
//       name: "Zephine",
//       symbolSize: 13,
//       value: 20.457146,
//       category: 2
//     },
//     {
//       id: "23",
//       name: "Fantine",
//       symbolSize: 20,
//       value: 42.4,
//       category: 2
//     },
//     {
//       id: "24",
//       name: "MmeThenardier",
//       symbolSize: 16,
//       value: 31.428574,
//       category: 7
//     },
//     {
//       id: "25",
//       name: "Thenardier",
//       symbolSize: 16,
//       value: 45.142853,
//       category: 7
//     }
//   ], [
//     {
//       source: "1",
//       target: "0"
//     },
//     {
//       source: "2",
//       target: "0"
//     },
//     {
//       source: "3",
//       target: "0"
//     },
//     {
//       source: "3",
//       target: "2"
//     },
//     {
//       source: "4",
//       target: "0"
//     },
//     {
//       source: "5",
//       target: "0"
//     },
//     {
//       source: "6",
//       target: "0"
//     },
//     {
//       source: "7",
//       target: "0"
//     },
//     {
//       source: "8",
//       target: "0"
//     },
//     {
//       source: "9",
//       target: "0"
//     },
//     {
//       source: "11",
//       target: "0"
//     },
//     {
//       source: "11",
//       target: "2"
//     },
//     {
//       source: "11",
//       target: "3"
//     },
//     {
//       source: "11",
//       target: "10"
//     },
//     {
//       source: "12",
//       target: "11"
//     },
//     {
//       source: "13",
//       target: "11"
//     },
//     {
//       source: "14",
//       target: "11"
//     },
//     {
//       source: "15",
//       target: "11"
//     },
//     {
//       source: "17",
//       target: "16"
//     },
//     {
//       source: "18",
//       target: "16"
//     },
//     {
//       source: "18",
//       target: "17"
//     },
//     {
//       source: "19",
//       target: "16"
//     },
//     {
//       source: "19",
//       target: "17"
//     },
//     {
//       source: "19",
//       target: "18"
//     },
//     {
//       source: "20",
//       target: "16"
//     },
//     {
//       source: "20",
//       target: "17"
//     },
//     {
//       source: "20",
//       target: "18"
//     },
//     {
//       source: "20",
//       target: "19"
//     },
//     {
//       source: "21",
//       target: "16"
//     },
//     {
//       source: "21",
//       target: "17"
//     },
//     {
//       source: "21",
//       target: "18"
//     },
//     {
//       source: "21",
//       target: "19"
//     },
//     {
//       source: "21",
//       target: "20"
//     },
//     {
//       source: "22",
//       target: "16"
//     },
//     {
//       source: "22",
//       target: "17"
//     },
//     {
//       source: "22",
//       target: "18"
//     },
//     {
//       source: "22",
//       target: "19"
//     },
//     {
//       source: "22",
//       target: "20"
//     },
//     {
//       source: "22",
//       target: "21"
//     },
//     {
//       source: "23",
//       target: "11"
//     },
//     {
//       source: "23",
//       target: "12"
//     },
//     {
//       source: "23",
//       target: "16"
//     },
//     {
//       source: "23",
//       target: "17"
//     },
//     {
//       source: "23",
//       target: "18"
//     },
//     {
//       source: "23",
//       target: "19"
//     },
//     {
//       source: "23",
//       target: "20"
//     },
//     {
//       source: "23",
//       target: "21"
//     },
//     {
//       source: "23",
//       target: "22"
//     },
//     {
//       source: "24",
//       target: "11"
//     },
//     {
//       source: "24",
//       target: "23"
//     },
//     {
//       source: "25",
//       target: "11"
//     },
//     {
//       source: "25",
//       target: "23"
//     },
//     {
//       source: "25",
//       target: "24"
//     }
//   ]
// ]
const data = [
  ['id', '名称', '大小'],
  [
    {
      id: '0',
      name: 'Myriel',
      symbolSize: 19,
    },
    {
      id: '1',
      name: 'Napoleon',
      symbolSize: 4,
      value: 4,
    },
    {
      id: '2',
      name: 'MlleBaptistine',
      symbolSize: 6,
      value: 9.485714,
    },
    {
      id: '3',
      name: 'MmeMagloire',
      symbolSize: 6,
      value: 9.485714,
    },
    {
      id: '4',
      name: 'CountessDeLo',
      symbolSize: 3,
      value: 4,
    },
    {
      id: '5',
      name: 'Geborand',
      symbolSize: 3,
      value: 4,
    },
    {
      id: '6',
      name: 'Champtercier',
      symbolSize: 3,
      value: 4,
    },
    {
      id: '7',
      name: 'Cravatte',
      symbolSize: 2.3,
      value: 4,
    },
    {
      id: '8',
      name: 'Count',
      symbolSize: 2.3,
      value: 4,
    },
    {
      id: '9',
      name: 'OldMan',
      symbolSize: 2.3,
      value: 4,
    },
    {
      id: '10',
      name: 'Labarre',
      symbolSize: 2.3,
      value: 4,
    },
    {
      id: '11',
      name: 'Valjean',
      symbolSize: 12,
      value: 100,
    },
    {
      id: '12',
      name: 'Marguerite',
      symbolSize: 5,
      value: 6.742859,
    },
    {
      id: '13',
      name: 'MmeDeR',
      symbolSize: 2.3,
      value: 4,
      category: 1,
    },
    {
      id: '14',
      name: 'Isabeau',
      symbolSize: 2.3,
      value: 4,
      category: 1,
    },
    {
      id: '15',
      name: 'Gervais',
      symbolSize: 2.3,
      value: 4,
      category: 1,
    },
    {
      id: '16',
      name: 'Tholomyes',
      symbolSize: 17,
      value: 25.942856,
      category: 2,
    },
    {
      id: '17',
      name: 'Listolier',
      symbolSize: 13,
      value: 20.457146,
      category: 2,
    },
    {
      id: '18',
      name: 'Fameuil',
      symbolSize: 13,
      value: 20.457146,
      category: 2,
    },
    {
      id: '19',
      name: 'Blacheville',
      symbolSize: 13,
      value: 20.457146,
      category: 2,
    },
    {
      id: '20',
      name: 'Favourite',
      symbolSize: 13,
      value: 20.457146,
      category: 2,
    },
    {
      id: '21',
      name: 'Dahlia',
      symbolSize: 13,
      value: 20.457146,
      category: 2,
    },
    {
      id: '22',
      name: 'Zephine',
      symbolSize: 13,
      value: 20.457146,
      category: 2,
    },
    {
      id: '23',
      name: 'Fantine',
      symbolSize: 20,
      value: 42.4,
      category: 2,
    },
    {
      id: '24',
      name: 'MmeThenardier',
      symbolSize: 16,
      value: 31.428574,
      category: 7,
    },
    {
      id: '25',
      name: 'Thenardier',
      symbolSize: 16,
      value: 45.142853,
      category: 7,
    },
  ],
  [
    {
      source: '1',
      target: '0',
    },
    {
      source: '2',
      target: '0',
    },
    {
      source: '3',
      target: '0',
    },
    {
      source: '3',
      target: '2',
    },
    {
      source: '4',
      target: '0',
    },
    {
      source: '5',
      target: '0',
    },
    {
      source: '6',
      target: '0',
    },
    {
      source: '7',
      target: '0',
    },
    {
      source: '8',
      target: '0',
    },
    {
      source: '9',
      target: '0',
    },
    {
      source: '11',
      target: '0',
    },
    {
      source: '11',
      target: '2',
    },
    {
      source: '11',
      target: '3',
    },
    {
      source: '11',
      target: '10',
    },
    {
      source: '12',
      target: '11',
    },
    {
      source: '13',
      target: '11',
    },
    {
      source: '14',
      target: '11',
    },
    {
      source: '15',
      target: '11',
    },
    {
      source: '17',
      target: '16',
    },
    {
      source: '18',
      target: '16',
    },
    {
      source: '18',
      target: '17',
    },
    {
      source: '19',
      target: '16',
    },
    {
      source: '19',
      target: '17',
    },
    {
      source: '19',
      target: '18',
    },
    {
      source: '20',
      target: '16',
    },
    {
      source: '20',
      target: '17',
    },
    {
      source: '20',
      target: '18',
    },
    {
      source: '20',
      target: '19',
    },
    {
      source: '21',
      target: '16',
    },
    {
      source: '21',
      target: '17',
    },
    {
      source: '21',
      target: '18',
    },
    {
      source: '21',
      target: '19',
    },
    {
      source: '21',
      target: '20',
    },
    {
      source: '22',
      target: '16',
    },
    {
      source: '22',
      target: '17',
    },
    {
      source: '22',
      target: '18',
    },
    {
      source: '22',
      target: '19',
    },
    {
      source: '22',
      target: '20',
    },
    {
      source: '22',
      target: '21',
    },
    {
      source: '23',
      target: '11',
    },
    {
      source: '23',
      target: '12',
    },
    {
      source: '23',
      target: '16',
    },
    {
      source: '23',
      target: '17',
    },
    {
      source: '23',
      target: '18',
    },
    {
      source: '23',
      target: '19',
    },
    {
      source: '23',
      target: '20',
    },
    {
      source: '23',
      target: '21',
    },
    {
      source: '23',
      target: '22',
    },
    {
      source: '24',
      target: '11',
    },
    {
      source: '24',
      target: '23',
    },
    {
      source: '25',
      target: '11',
    },
    {
      source: '25',
      target: '23',
    },
    {
      source: '25',
      target: '24',
    },
  ],
]
const graphOption = {
  title: [
    {
      text: '基础热力图',
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
