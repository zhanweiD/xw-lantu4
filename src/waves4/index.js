import basicLine from './waves/lines/basic-line'
import demoLine from './waves/demo-line'
import i18n from '@i18n'

const waves = {
  basicLine,
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
    // 柱状图
    name: 'classifyLine',
    icon: 'exhibit-line',
    exhibits: [
      basicLine, // 基础柱状图
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
// categories.forEach((category) => {
//   category.exhibits.forEach((exhibit, i) => {
//     if (exhibit.completed) {
//       const k = i18n.sandbox(exhibit.i18n, exhibit.id || exhibit.icon)
//       exhibit.config = exhibit.config(k)
//       category.exhibits[i] = {
//         ...exhibit,
//         key: exhibit.config.key,
//         name: exhibit.config.name
//       }
//     }
//   })
// })

export {categories}
