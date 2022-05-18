import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MInput from '@wavesSrc/input'
import translate from './translate'

/**
 * react hook 组件适配器
 */
const Adapter = () =>
  createExhibitAdapter({
    //初始化
    init({options}) {
      const mInput = MInput.create()
      const translatedOptions = translate(options)
      // 初始化模型
      mInput.init(translatedOptions, {})
      mInput.draw({
        redraw: true,
      })
      return mInput
    },
    // 处理包括数据，样式等变更
    update({options}) {
      try {
        const mInput = MInput.create()
        const translatedOptions = translate(options)
        // 初始化模型
        mInput.init(translatedOptions, {})
        mInput.draw({
          redraw: true,
        })
      } catch (error) {
        console.error('图层配置解析错误，更新失败', error)
      }
    },
    // 如果组件有销毁函数，就调用
    destroy({instance}) {
      instance.destroy()
    },

    // 任何错误的处理
    warn({instance, warn}) {
      instance.warn(warn)
    },
  })

export default Adapter
