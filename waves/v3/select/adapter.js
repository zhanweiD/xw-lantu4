import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MSelect from '@wavesSrc/select'
import translate from './translate'

/**
 * react hook 组件适配器
 */
// eslint-disable-next-line no-unused-vars
const Adapter = (k) =>
  createExhibitAdapter({
    // 初始化
    init({options, event}) {
      const translatedOptions = translate(options)
      const mSelect = MSelect.create()
      mSelect.init(translatedOptions, {})
      mSelect.data(translatedOptions)
      mSelect.draw({
        redraw: true,
      })
      mSelect.event.on('onSwitchOption', (info) => {
        console.log('info...', info)
        event.fire('switchPanel', info)
      })
      return mSelect
    },

    // 处理包括数据、样式等变更
    update({options}) {
      try {
        const mSelect = MSelect.create()
        const translatedOptions = translate(options)
        // 初始化模型
        mSelect.init(translatedOptions, {})
        mSelect.data(translatedOptions)
        mSelect.draw({
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
