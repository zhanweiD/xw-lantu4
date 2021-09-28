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
import demoLine from './waves/demo-line'
import i18n from '@i18n'

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
  // echarts
  demoLine,
}

Object.values(waves).forEach((wave) => {
  const k = i18n.sandbox(wave.i18n, wave.id || wave.icon)
  wave.config = wave.config(k)
  wave.Adapter = wave.makeAdapter({k})
})

export default waves

const categories = [
  {
    // 折线图
    name: 'classifyLine',
    icon: 'exhibit-line',
    exhibits: [
      basicLine, // 基础折线图
      groupLine,
      areaLine,
      stackAreaLine,
      stepLine,
    ],
  },
  {
    // 柱状图
    name: 'classifyColumn',
    icon: 'exhibit-column',
    exhibits: [
      basicColumn, // 基础柱状图
      groupColumn,
      stackColumn,
      percentageColumn,
      intervalColumn,
      waterfallColumn,
      basicLineColumn,
      groupLineColumn,
      stackLineColumn,
    ],
  },
  {
    // 演示对接
    name: 'demo',
    icon: 'demo-line',
    exhibits: [
      demoLine, // 折线
    ],
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
      }
    }
  })
})

export {categories}
