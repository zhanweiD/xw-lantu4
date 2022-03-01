import basicLine from './waves/lines/basic-line'
import areaLine from './waves/lines/area-line'
import groupLine from './waves/lines/group-line'
import stackAreaLine from './waves/lines/stack-area-line'
import stepLine from './waves/lines/step-line'
import basicColumn from './waves/columns/basic-column'
import groupColumn from './waves/columns/group-column'
import stackColumn from './waves/columns/stack-column'
import intervalColumn from './waves/columns/interval-column'
import waterfallColumn from './waves/columns/waterfall-column'
import basicLineColumn from './waves/line-columns/basic-line-column'
import groupLineColumn from './waves/line-columns/group-line-column'
import stackLineColumn from './waves/line-columns/stack-line-column'
import percentageColumn from './waves/columns/percentage-column'
import basicBar from './waves/bars/basic-bar'
import groupBar from './waves/bars/group-bar'
import stackBar from './waves/bars/stack-bar'
import percentageBar from './waves/bars/percentage-bar'
import intervalBar from './waves/bars/interval-bar'
import waterfallBar from './waves/bars/waterfall-bar'
import basicRadar from './waves/radars/basic-radar'
import groupRadar from './waves/radars/group-radar'
import basicPie from './waves/pies/basic-pie'
import donut from './waves/pies/donut'
import nigntingaleRose from './waves/pies/nightingale-rose'
import donutNightingaleRose from './waves/pies/donut-nightingale-rose'
import stackNightingaleRose from './waves/pies/stack-nightingale-rose'
import scatter from './waves/scatters/scatter'
import bubble from './waves/scatters/bubble'
import textarea from './waves/v3/textarea'
import demoLine from './waves/demo-line'
import text from './waves/others/text'
import dashboard from './waves/others/dashboard'
import indicator from './waves/others/indicator'
import pack from './waves/relations/pack'
import edgeBundle from './waves/relations/edge-bundle'
import chord from './waves/relations/chord'
import sankey from './waves/relations/sankey'
import tree from './waves/relations/tree'
import treemap from './waves/relations/treemap'
import rectMatrix from './waves/matrices/rect-matrix'
import circleMatrix from './waves/matrices/circle-matrix'
import baseMap from './waves/map/baseMap'
import timeline from './waves/others/timeline'
import i18n from '@i18n'
import categoriesEcharts, {echartsWaves} from '@wavesEcharts'

const waves = {
  // 折线
  basicLine,
  areaLine,
  groupLine,
  stackAreaLine,
  stepLine,
  // 柱状
  basicColumn,
  groupColumn,
  stackColumn,
  intervalColumn,
  waterfallColumn,
  percentageColumn,
  // 折柱
  basicLineColumn,
  groupLineColumn,
  stackLineColumn,
  // 条形
  basicBar,
  groupBar,
  stackBar,
  percentageBar,
  intervalBar,
  waterfallBar,
  // 热力图
  rectMatrix,
  circleMatrix,
  // 雷达
  basicRadar,
  groupRadar,
  // 饼图
  basicPie,
  donut,
  nigntingaleRose,
  donutNightingaleRose,
  stackNightingaleRose,
  // 散点图
  scatter,
  bubble,
  // 关系图
  pack,
  edgeBundle,
  chord,
  sankey,
  tree,
  treemap,
  // 地图
  baseMap,
  // 其他
  text,
  dashboard,
  indicator,
  timeline,
  // echarts
  demo: demoLine,
  ...echartsWaves,
  // 段落
  textarea,
}

Object.values(waves).forEach((wave) => {
  const k = i18n.sandbox(wave.i18n, wave.id || wave.icon)
  wave.config = wave.config(k)
  wave.Adapter = wave.makeAdapter({k})
})

export default waves

const categories = [
  {
    name: 'baseCharts',
    icon: 'exhibit-line',
    exhibits: [
      basicLine, // 基础折线图
      groupLine,
      areaLine,
      stackAreaLine,
      stepLine,
      basicColumn,
      groupColumn,
      stackColumn,
      percentageColumn,
      intervalColumn,
      waterfallColumn,
      basicLineColumn,
      groupLineColumn,
      stackLineColumn,
      basicBar,
      groupBar,
      stackBar,
      percentageBar,
      intervalBar,
      waterfallBar,
      basicPie,
      donut,
      nigntingaleRose,
      donutNightingaleRose,
      stackNightingaleRose,
      scatter,
      bubble,
      basicRadar,
      groupRadar,
    ],
  },
  {
    // 关系图
    name: 'classifyRelation',
    icon: 'exhibit-relation',
    exhibits: [edgeBundle, chord, sankey, tree, treemap, pack],
  },
  // 聚焦图
  {
    name: 'classifyFocus',
    icon: 'exhibit-relation',
    exhibits: [rectMatrix, circleMatrix],
  },
  {
    // 地图
    name: 'classifyMap',
    icon: 'exhibit-map',
    exhibits: [baseMap],
  },
  // 文字
  {
    name: 'text',
    icon: 'exhibit-relation',
    exhibits: [text, textarea, timeline],
  },
  // 指标
  {
    name: 'indicators',
    icon: 'exhibit-relation',
    exhibits: [dashboard, indicator],
  },
  // 多媒体
  {
    name: 'classifyMedia',
    icon: 'exhibit-relation',
    exhibits: [],
  },
  // 交互
  {
    name: 'preInteraction',
    icon: 'exhibit-relation',
    exhibits: [],
  },

  // {
  //   // 折线图
  //   name: 'classifyLine',
  //   icon: 'exhibit-line',
  //   exhibits: [
  //     basicLine, // 基础折线图
  //     groupLine,
  //     areaLine,
  //     stackAreaLine,
  //     stepLine,
  //   ],
  // },
  // {
  //   // 柱状图
  //   name: 'classifyColumn',
  //   icon: 'exhibit-column',
  //   exhibits: [
  //     basicColumn,
  //     groupColumn,
  //     stackColumn,
  //     percentageColumn,
  //     intervalColumn,
  //     waterfallColumn,
  //     basicLineColumn,
  //     groupLineColumn,
  //     stackLineColumn,
  //   ],
  // },
  // {
  //   // 条形图
  //   name: 'classifyBar',
  //   icon: 'exhibit-bar',
  //   exhibits: [basicBar, groupBar, stackBar, percentageBar, intervalBar, waterfallBar],
  // },
  // {
  //   // 饼图
  //   name: 'classifyPie',
  //   icon: 'exhibit-pie',
  //   exhibits: [basicPie, donut, nigntingaleRose, donutNightingaleRose, stackNightingaleRose],
  // },
  // {
  //   // 散点图
  //   name: 'classifyScatter',
  //   icon: 'exhibit-scatter',
  //   exhibits: [scatter, bubble],
  // },
  // {
  //   // 雷达图
  //   name: 'classifyRadar',
  //   icon: 'exhibit-radar',
  //   exhibits: [basicRadar, groupRadar],
  // },
  // {
  //   // 热力图
  //   name: 'classifyHeatmap',
  //   icon: 'exhibit-heatmap',
  //   exhibits: [rectMatrix, circleMatrix],
  // },
  // {
  //   // 关系图
  //   name: 'classifyRelation',
  //   icon: 'exhibit-relation',
  //   exhibits: [edgeBundle, chord, sankey, tree, treemap, pack],
  // },
  // {
  //   // 基础地图
  //   name: 'classifyMap',
  //   icon: 'exhibit-map',
  //   exhibits: [baseMap],
  // },
  // {
  //   // NOTE gis是内置特殊的名字，不能修改，
  //   // NOTE gis类组件的数据特殊，每一层都有自己的数据，不是整个组件共享的数据
  //   // NOTE 所以，gis组件的图层模型的deepKeys会多出data配置
  //   name: 'gis',
  //   icon: 'gis',
  //   exhibits: [],
  // },
  // {
  //   // 其他
  //   name: 'others',
  //   icon: 'exhibit-other',
  //   exhibits: [text, textarea, dashboard, indicator, timeline],
  // },
  // {
  //   // 演示对接
  //   name: 'demo',
  //   icon: 'demo-line',
  //   exhibits: [],
  // },
]

categories.forEach((category) => {
  category.exhibits.forEach((exhibit, i) => {
    if (exhibit.completed) {
      const {config} = exhibit
      category.exhibits[i] = {
        ...exhibit,
        key: config.key,
        name: config.name,
        category: category.name,
      }

      if (waves[config.key]) {
        waves[config.key].category = category.name
      }
    }
  })
})

categoriesEcharts.forEach((category) => {
  category.exhibits.forEach((exhibit, i) => {
    if (exhibit.completed) {
      const {config} = exhibit
      category.exhibits[i] = {
        ...exhibit,
        key: config.key,
        name: config.name,
        category: category.name,
      }

      if (waves[config.key]) {
        waves[config.key].category = category.name
      }
    }
  })
})

export {categories, categoriesEcharts}
