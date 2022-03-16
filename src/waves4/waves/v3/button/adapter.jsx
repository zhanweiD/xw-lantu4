import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MButton from '@wavesSrc/button'
import translate from './translate'

/**
 * react hook 组件适配器
 */
const Adapter = () =>
  createExhibitAdapter({
    // 初始化
    init({options}) {
      const mButton = MButton.create()
      const translatedOptions = translate(options)
      translatedOptions.buttonData = {}
      translatedOptions.buttonName = '按钮'
      // 初始化模型
      mButton.init(translatedOptions, {})
      // instance.draw({
      //   redraw: true,
      // })
      return mButton
    },
    // 处理包括数据、样式等变更
    update({options}) {
      try {
        console.log(options)
        // const translatedOptions = translate(options)
        // 初始化模型
        // mButton.init(translatedOptions, {})
        // instance.draw({
        //   redraw: true,
        // })
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
