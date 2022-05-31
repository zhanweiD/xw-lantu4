import translate from './translate'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import Textarea from '../../../../waves-src/textarea'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      const translatedOptions = translate(options)

      const instance = new Textarea(translatedOptions)

      instance.data(translatedOptions.data)

      instance.draw({
        redraw: true,
      })

      return instance
    },

    // 处理包括数据、样式等变更
    update(options) {
      // 更新的 action 会有不同
      // data 数据呈现的修改
      // layer 段落层的属性修改
      try {
        const {instance, options: optionsData} = options

        const translatedOptions = translate(optionsData)
        instance._option = translatedOptions
        instance.data(translatedOptions.data)
        instance.draw({
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
