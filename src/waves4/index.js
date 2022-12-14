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
import wordCloud from './waves/v3/word-cloud'
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
import river from './waves/v3/river'
import renju from './waves/v3/renju'
import semicircle from './waves/v3/semicircle'
import horizontalHourglass from './waves/v3/hourglass'
import histogram from './waves/v3/histogram'
import bulletColumn from './waves/v3/bullet-column'
import radialBar from './waves/v3/radial-bar'
import orderedList from './waves/v3/ordered-list'
import pyramid from './waves/v3/pyramid'
import progress from './waves/v3/progress'
import bullet from './waves/v3/bullet'
import gis from './waves/gis'
import picture from './waves/v3/picture'
import pictureGroupScroll from './waves/v3/picture-group-scroll'
import pictureGroup from './waves/v3/picture-group'
import video from './waves/v3/video'
import videoMulti from './waves/v3/video-multi'
import iframe from './waves/v3/iframe'
import uiTable from './waves/v3/ui-table'
import button from './waves/v3/button'

import select from './waves/v3/select'
import DatetimePicker from './waves/v3/datetime-picker'
import input from './waves/v3/input'
import search from './waves/v3/search'
import switchs from './waves/v3/switch'
import uiTabButton from './waves/v3/ui-tab-button'

import i18n from '@i18n'
import categoriesEcharts, {echartsWaves} from '@wavesEcharts'

const waves = {
  // ??????
  basicLine,
  areaLine,
  groupLine,
  stackAreaLine,
  stepLine,
  river,
  // ??????
  basicColumn,
  groupColumn,
  stackColumn,
  intervalColumn,
  waterfallColumn,
  percentageColumn,
  renju,
  semicircle,
  horizontalHourglass,
  histogram,
  bulletColumn,
  // ??????
  basicLineColumn,
  groupLineColumn,
  stackLineColumn,
  // ??????
  basicBar,
  groupBar,
  stackBar,
  percentageBar,
  intervalBar,
  waterfallBar,
  radialBar,
  bullet,
  orderedList,
  pyramid,
  progress,
  // ?????????
  rectMatrix,
  circleMatrix,
  // ??????
  basicRadar,
  groupRadar,
  // ??????
  basicPie,
  donut,
  nigntingaleRose,
  donutNightingaleRose,
  stackNightingaleRose,
  // ?????????
  scatter,
  bubble,
  // ?????????
  pack,
  edgeBundle,
  chord,
  sankey,
  tree,
  treemap,
  // ??????
  baseMap,
  gis,
  // ??????
  text,
  dashboard,
  indicator,
  timeline,
  // echarts
  demo: demoLine,
  ...echartsWaves,
  // ??????
  textarea,
  // ??????
  wordCloud,
  // ????????????
  picture,
  pictureGroup,
  // ??????????????????
  pictureGroupScroll,
  video,
  videoMulti,
  iframe,
  // ??????
  button,
  select,
  input,
  search,
  uiTabButton,
  switchs,
  DatetimePicker,
  uiTable,
}

Object.values(waves).forEach((wave) => {
  const k = i18n.sandbox(wave.i18n, wave.id || wave.icon)
  wave.config = wave.config(k)
  wave.Adapter = wave.makeAdapter({k})
})

export default waves

const categories = [
  {
    // ?????????
    name: 'classifyLine',
    icon: 'exhibit-line',
    exhibits: [
      basicLine, // ???????????????
      groupLine,
      areaLine,
      stackAreaLine,
      stepLine,
      river,
    ],
  },
  {
    // ?????????
    name: 'classifyColumn',
    icon: 'exhibit-column',
    exhibits: [
      basicColumn,
      groupColumn,
      stackColumn,
      percentageColumn,
      intervalColumn,
      waterfallColumn,
      basicLineColumn,
      groupLineColumn,
      stackLineColumn,
      renju,
      semicircle,
      horizontalHourglass,
      histogram,
      bulletColumn,
    ],
  },
  {
    // ?????????
    name: 'classifyBar',
    icon: 'exhibit-bar',
    exhibits: [
      basicBar,
      groupBar,
      stackBar,
      percentageBar,
      intervalBar,
      waterfallBar,
      radialBar,
      bullet,
      orderedList,
      pyramid,
      progress,
    ],
  },
  {
    // ??????
    name: 'classifyPie',
    icon: 'exhibit-pie',
    exhibits: [basicPie, donut, nigntingaleRose, donutNightingaleRose, stackNightingaleRose],
  },
  {
    // ?????????
    name: 'classifyScatter',
    icon: 'exhibit-scatter',
    exhibits: [scatter, bubble],
  },
  {
    // ?????????
    name: 'classifyRadar',
    icon: 'exhibit-radar',
    exhibits: [basicRadar, groupRadar],
  },
  {
    // ?????????
    name: 'classifyHeatmap',
    icon: 'exhibit-heatmap',
    exhibits: [rectMatrix, circleMatrix],
  },
  {
    // ?????????
    name: 'classifyRelation',
    icon: 'exhibit-relation',
    exhibits: [edgeBundle, chord, sankey, tree, treemap, pack],
  },
  {
    // ??????
    name: 'classifyMap',
    icon: 'exhibit-map',
    exhibits: [baseMap, gis],
  },
  {
    // ??????
    name: 'classifyText',
    icon: 'exhibit-text',
    exhibits: [text, textarea, wordCloud],
  },
  {
    // ??????
    name: 'classifyIndicators',
    icon: 'exhibit-indicators',
    exhibits: [dashboard, indicator, timeline],
  },
  {
    // ?????????
    name: 'classifyMedia',
    icon: 'exhibit-classifyMedia',
    exhibits: [picture, pictureGroup, pictureGroupScroll, video, videoMulti, iframe, uiTable],
  },
  {
    // ????????????
    name: 'classifyInteractiv',
    icon: 'demo-line',
    // input
    exhibits: [button, search, uiTabButton, select, switchs, DatetimePicker],
  },
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
