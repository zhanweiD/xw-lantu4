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
    // icon: 'exhibit-rect',
    icon: 'exhibit-bar',
    exhibits: [echertsBasicBar, echertsGroupBar, echertsStackBar, echertsWaterfallBar],
  },
]

export default categoriesEcharts

const echartsWaves = {
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
