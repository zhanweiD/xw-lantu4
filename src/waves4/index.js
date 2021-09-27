import basicLine from './waves/lines/basic-line'
import basicColumn from './waves/columns/basic-column'
import demoLine from './waves/demo-line'
import i18n from '@i18n'

const waves = {
  basicLine,
  basicColumn,
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
    ],
  },
  {
    // 折线图
    name: 'classifyColumn',
    icon: 'exhibit-column',
    exhibits: [
      basicColumn, // 基础柱状图
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
