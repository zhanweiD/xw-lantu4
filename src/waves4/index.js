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
import demoLine from './waves/demo-line'
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
  // 雷达
  basicRadar,
  groupRadar,
  // 饼图
  basicPie,
  donut,
  nigntingaleRose,
  donutNightingaleRose,
  stackNightingaleRose,
  // echarts
  demo: demoLine,
  ...echartsWaves,
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
      basicColumn,
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
    // 条形图
    name: 'classifyBar',
    icon: 'exhibit-bar',
    exhibits: [basicBar, groupBar, stackBar, percentageBar, intervalBar, waterfallBar],
  },
  {
    // 雷达图
    name: 'classifyRadar',
    icon: 'exhibit-radar',
    exhibits: [basicRadar, groupRadar]
  },
  {
    // 饼图
    name: 'classifyPie',
    icon: 'exhibit-pie',
    exhibits: [basicPie, donut, nigntingaleRose, donutNightingaleRose, stackNightingaleRose]
  },
  {
    // NOTE gis是内置特殊的名字，不能修改，
    // NOTE gis类组件的数据特殊，每一层都有自己的数据，不是整个组件共享的数据
    // NOTE 所以，gis组件的图层模型的deepKeys会多出data配置
    name: 'gis',
    icon: 'gis',
    exhibits: [],
  },
  {
    // 演示对接
    name: 'demo',
    icon: 'demo-line',
    exhibits: [],
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
