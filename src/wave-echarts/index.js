import {echertsBasicLine} from './line-base'
import {echertsGroupLine} from './line-group'
import {echartsBasicAreaLine} from './line-base-area'
import {echartsGroupAreaLine} from './line-group-area'
import {echartslineAndArea} from './line-base-line-area'

// import {echertsBasicColumn} from

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
    icon: 'exhibit-bar',
    exhibits: [echertsBasicBar, echertsGroupBar, echertsStackBar, echertsWaterfallBar],
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
  echertsBasicBar,
  echertsStackBar,
  echertsGroupBar,
  echertsWaterfallBar,
}

export {echartsWaves}
