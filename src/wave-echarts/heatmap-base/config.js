import hJSON from 'hjson'
const data = [
  [0, 0, 0.5],
  [0, 1, 0.507704],
  [0, 2, 0.546336],
  [0, 3, 0.614156],
  [0, 4, 0.690464],
  [0, 5, 0.75],
  [0, 6, 0.773024],
  [0, 7, 0.7510760000000001],
  [0, 8, 0.6884159999999999],
  [0, 9, 0.5991439999999999],
  [1, 0, 0.606848],
  [1, 1, 0.612656816],
  [1, 2, 0.64453967104],
  [1, 3, 0.6991964739200001],
  [1, 4, 0.75698115584],
  [1, 5, 0.795292],
  [1, 6, 0.7977159296],
  [1, 7, 0.75892675424],
  [1, 8, 0.68533737472],
  [1, 9, 0.59150594624],
  [2, 0, 0.7347520000000001],
  [2, 1, 0.7338612505600001],
  [2, 2, 0.7512105472000001],
  [2, 3, 0.78191393152],
  [2, 4, 0.8091422003200001],
  [2, 5, 0.815248],
  [2, 6, 0.78907134976],
  [2, 7, 0.7294255936],
  [2, 8, 0.64476378112],
  [2, 9, 0.54902547712],
  [3, 0, 0.865232],
  [3, 1, 0.8514076668799999],
  [3, 2, 0.84551849088],
  [3, 3, 0.8416473704],
  [3, 4, 0.82793345024],
  [3, 5, 0.793998],
  [3, 6, 0.73545930368],
  [3, 7, 0.6555365604800001],
  [3, 8, 0.5637427968],
  [3, 9, 0.47166678944],
  [4, 0, 0.963488],
  [4, 1, 0.93167634176],
  [4, 2, 0.8974274252800001],
  [4, 3, 0.85505826176],
  [4, 4, 0.7992318463999999],
  [4, 5, 0.727792],
  [4, 6, 0.64302089216],
  [4, 7, 0.55131924608],
  [4, 8, 0.46130922495999993],
  [4, 9, 0.38036000000000003],
  [5, 0, 1],
  [5, 1, 0.9478599999999999],
  [5, 2, 0.8855200000000001],
  [5, 3, 0.8092299999999999],
  [5, 4, 0.72064],
  [5, 5, 0.625],
  [5, 6, 0.5293599999999999],
  [5, 7, 0.44077000000000005],
  [5, 8, 0.3644799999999999],
  [5, 9, 0.3021400000000001],
  [6, 0, 0.963488],
  [6, 1, 0.8919572864],
  [6, 2, 0.80693289984],
  [6, 3, 0.70824086912],
  [6, 4, 0.60379526144],
  [6, 5, 0.503952],
  [6, 6, 0.4174399999999999],
  [6, 7, 0.34886962303999997],
  [6, 8, 0.29781844991999995],
  [6, 9, 0.25949437183999996],
  [7, 0, 0.8652320000000001],
  [7, 1, 0.77823717536],
  [7, 2, 0.6794027968],
  [7, 3, 0.5732105259200001],
  [7, 4, 0.47215281152000005],
  [7, 5, 0.3886180000000001],
  [7, 6, 0.3296864345600001],
  [7, 7, 0.29483754320000005],
  [7, 8, 0.27656791552],
  [7, 9, 0.26392036832],
  [8, 0, 0.7347519999999998],
  [8, 1, 0.6381743180799999],
  [8, 2, 0.5354229452799999],
  [8, 3, 0.4358199999999999],
  [8, 4, 0.35424277503999985],
  [8, 5, 0.30212799999999984],
  [8, 6, 0.28229567487999996],
  [8, 7, 0.28759247487999995],
  [8, 8, 0.30335472640000005],
  [8, 9, 0.31369095423999993],
  [9, 0, 0.6068480000000002],
  [9, 1, 0.5068553273600002],
  [9, 2, 0.4085104204800002],
  [9, 3, 0.3253052105600003],
  [9, 4, 0.2724013568000002],
  [9, 5, 0.25813200000000025],
  [9, 6, 0.2797495577600002],
  [9, 7, 0.3234195612800001],
  [9, 8, 0.3684605337600002],
  [9, 9, 0.39582991039999993],
]
const heatmapOption = {
  title: [
    {
      text: '???????????????',
      textStyle: {
        color: '#fff',
      },
    },
  ],
  tooltip: {},
  xAxis: {
    type: 'category',
    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  yAxis: {
    type: 'category',
    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  visualMap: {
    min: 0,
    max: 1,
    calculable: true,
    realtime: false,
    inRange: {
      color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026',
      ],
    },
  },
  series: [
    {
      type: 'heatmap',
      // data: data,
      emphasis: {
        itemStyle: {
          borderColor: '#333',
          borderWidth: 1,
        },
      },
      progressive: 1000,
      animation: false,
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
        defaultValue: hJSON.stringify(heatmapOption, {space: 2, quotes: 'strings', separator: true}),
      },
    ],
  }
}

export const config = (k) => ({
  key: 'echartsHeatmapBase',
  name: k('echartsHeatmapBase'),
  data,
  // ??????????????????????????????
  layout: () => [10, 6],
  // ?????????????????????????????????
  padding: [0, 0, 0, 0],
  layers: [lineLayersss(k)],
})
