import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import translate from './translate'
import Dot from '../../../waves-src/dot'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      const translatedOptions = translate(options)
      const myDot = Dot.create()
      myDot.init(translatedOptions, {})
      myDot.draw({
        redraw: true,
      })
      return myDot
    },

    // 处理包括数据、样式等变更
    update({options = {}}) {
      try {
        const myDot = Dot.create()
        const translatedOptions = translate(options)
        // 初始化模型
        myDot.init(translatedOptions, {})
        myDot.draw({
          redraw: true,
        })
      } catch (error) {
        console.error('图层配置解析错误，更新失败', error)
      }
    },

    // 销毁图表实例
    destroy({instance}) {
      instance.destroy()
    },

    // 任何错误的处理
    warn({instance, warn}) {
      instance.warn(warn)
    },
  })

export default Adapter
