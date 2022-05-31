import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MDecoration from '@wavesSrc/decoration'
import translate from './translate'

// 组件适配器
const Adapter = () =>
  createExhibitAdapter({
    // 初始化
    init({options}) {
      const mDecoration = MDecoration.create()
      const translatedOptions = translate(options)
      // 初始化模型
      mDecoration.init(translatedOptions, {})
      mDecoration.draw({
        redraw: true,
      })
      return mDecoration
    },
    // 处理包括数据，样式等变更
    update({options}) {
      try {
        const mDecoration = MDecoration.create()
        const translatedOptions = translate(options)
        // 初始化模型
        mDecoration.init(translatedOptions, {})
        mDecoration.draw({
          redraw: true,
        })
      } catch (error) {
        console.error('图层配置解析错误，更新失败', error)
      }
    },

    // 销毁
    destroy({instance}) {
      instance.destroy()
    },

    // 任何错误的处理
    warn({instance, warn}) {
      instance.warn(warn)
    },
  })

export default Adapter
