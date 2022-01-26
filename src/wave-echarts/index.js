import {echertsBasicBar} from './bar'
import {echertsBasicLine} from './line-base'
import {echertsGroupLine} from './line-group'
import {echartsBasicAreaLine} from './line-base-area'
import {echartsGroupAreaLine} from './line-group-area'
import {echartslineAndArea} from './line-base-line-area'

const categoriesEcharts = [
  {
    // 折线图
    name: 'echartsLine',
    icon: 'exhibit-line',
    exhibits: [echertsBasicLine, echertsGroupLine, echartsBasicAreaLine, echartsGroupAreaLine, echartslineAndArea],
  },
  {
    name: 'echartsBar',
    icon: 'exhibit-rect',
    exhibits: [echertsBasicBar],
  },
]

export default categoriesEcharts

const echartsWaves = {
  echertsBasicBar,
  echertsBasicLine,
  echertsGroupLine,
  echartsBasicAreaLine,
  echartsGroupAreaLine,
  echartslineAndArea,
}

export {echartsWaves}
