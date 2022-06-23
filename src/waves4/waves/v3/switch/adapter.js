import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MSwitch from '../../../../waves-src/switch'
import translate from './translate'

/**
 * react hook 组件适配器
 */
const Adapter = () =>
  createExhibitAdapter({
    //初始化
    init({options, event}) {
      const mSwitch = MSwitch.create()
      const translatedOptions = translate(options)
      // 初始化模型
      mSwitch.init(translatedOptions, {})
      mSwitch.draw({
        redraw: true,
      })
      mSwitch.event.on('onToggleSwitch', (data) => {
        event.fire('toggleSwitch', data)
      })
      return mSwitch
    },
    // 处理包括数据，样式等变更
    update({options}) {
      try {
        const mSwitch = MSwitch.create()
        const translatedOptions = translate(options)
        // 初始化模型
        mSwitch.init(translatedOptions, {})
        mSwitch.draw({
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
