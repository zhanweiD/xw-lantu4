import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MyWordCloud from '@wavesSrc/word-cloud'
import translate from './translate'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化
    init({options}) {
      const translatedOptions = translate(options)
      const instance = new MyWordCloud(translatedOptions)
      instance.data(translatedOptions.data)
      instance.draw({
        redraw: true,
      })
      return instance
    },

    // 处理包括数据、样式等变更
    update({options}) {
      try {
        const translatedOptions = translate(options)
        const instance = new MyWordCloud(translatedOptions)
        instance._option = translatedOptions
        instance.data(translatedOptions.data)
        instance.draw({
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
