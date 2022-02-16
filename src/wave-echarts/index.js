import {echertsBasicLine} from './line-base'
import {echertsGroupLine} from './line-group'
import {echartsBasicAreaLine} from './line-base-area'
import {echartsGroupAreaLine} from './line-group-area'
import {echartslineAndArea} from './line-base-line-area'

import {echertsBasicColumn} from './colum-base'
import {echertsGroupColumn} from './colum-group'
import {echertsStackColumn} from './column-stack'
import {echertsWaterfallColumn} from './column-waterfall'
import {echertsBasicColumnLine} from './colum-line-base'
import {echertsGroupColumnLine} from './colum-line-group'
import {echertsStackColumnLine} from './colum-line-stack'

import {echertsBasicBar} from './bar-base'
import {echertsGroupBar} from './bar-group'
import {echertsStackBar} from './bar-stack'
import {echertsWaterfallBar} from './bar-waterfall'

import {echertsBasicPie} from './pie-base'
import {echartsRadiuRingPie} from './pie-radiu-ring'
import {echartsRingPie} from './pie-ring'
import {echartsRosePie} from './pie-rose'

import {echartsBaseScatter} from './scatter-base'
import {echartsEffectScatter} from './scatter-effectScatter'

import {echartsFunnelBase} from './funnel-base'

import {echartsRadarBase} from './radar-base'
import {echartsRadarGroup} from './radar-group'

import {echartsBoxesBase} from './boxes-base'

import {echartsBoxplotBase} from './boxplot-base'

import {echartsHeatmapBase} from './heatmap-base'

import {echartsGraphBase} from './graph-base'

import {echartsTreeBase} from './tree-base'

const categoriesEcharts = [
  {
    // 折线图
    name: 'echartsLine',
    icon: 'exhibit-line',
    exhibits: [echertsBasicLine, echertsGroupLine, echartsBasicAreaLine, echartsGroupAreaLine, echartslineAndArea],
  },
  {
    name: 'echartsColumn',
    // icon: 'exhibit-rect',
    icon: 'exhibit-column',
    exhibits: [
      echertsBasicColumn,
      echertsGroupColumn,
      echertsStackColumn,
      echertsWaterfallColumn,
      echertsBasicColumnLine,
      echertsGroupColumnLine,
      echertsStackColumnLine,
    ],
  },
  {
    name: 'echartsBar',
    icon: 'exhibit-bar',
    exhibits: [echertsBasicBar, echertsGroupBar, echertsStackBar, echertsWaterfallBar],
  },
  {
    name: 'echartsPie',
    icon: 'exhibit-pie',
    exhibits: [echertsBasicPie, echartsRadiuRingPie, echartsRingPie, echartsRosePie],
  },
  {
    name: 'echartsScatter',
    icon: 'scatter',
    exhibits: [echartsBaseScatter, echartsEffectScatter],
  },
  {
    name: 'echartsFunnal',
    icon: 'scatter',
    exhibits: [echartsFunnelBase],
  },
  {
    name: 'echartsRadar',
    icon: 'scatter',
    exhibits: [echartsRadarBase, echartsRadarGroup],
  },
  {
    name: 'echartsCandlestick',
    icon: 'scatter',
    exhibits: [echartsBoxesBase, echartsBoxplotBase],
  },
  {
    name: 'echartsHeatmap',
    icon: 'exhibit-heatmap',
    exhibits: [echartsHeatmapBase],
  },
  {
    name: 'echartsGraph',
    icon: 'exhibit-relation',
    exhibits: [echartsGraphBase, echartsTreeBase],
  },
]

export default categoriesEcharts

const echartsWaves = {
  echartsTreeBase,
  echartsGraphBase,
  echartsHeatmapBase,
  echartsBoxplotBase,
  echartsRadarGroup,
  echartsBoxesBase,
  echartsRadarBase,
  echartsFunnelBase,
  echartsEffectScatter,
  echartsBaseScatter,
  echartsRosePie,
  echartsRingPie,
  echertsBasicPie,
  echartsRadiuRingPie,
  echertsBasicLine,
  echertsGroupLine,
  echartsBasicAreaLine,
  echartsGroupAreaLine,
  echartslineAndArea,
  echertsBasicColumn,
  echertsGroupColumn,
  echertsStackColumn,
  echertsWaterfallColumn,
  echertsBasicColumnLine,
  echertsGroupColumnLine,
  echertsStackColumnLine,

  echertsBasicBar,
  echertsStackBar,
  echertsGroupBar,
  echertsWaterfallBar,
}

export {echartsWaves}
