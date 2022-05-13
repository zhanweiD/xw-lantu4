import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MSearch from '../../../../waves-src/serach'

import translate from './translate'

/**
 * react hook 组件适配器
 */
const Adapter = () =>
  createExhibitAdapter({
    //初始化
    init({options}) {
      const mSearch = MSearch.create()
      const translatedOptions = translate(options)
      // 初始化模型
      mSearch.init(translatedOptions, {})
      mSearch.draw({
        redraw: true,
      })
      return mSearch
    },
    // 处理包括数据，样式等变更
    update({options}) {
      try {
        const mSearch = MSearch.create()
        const translatedOptions = translate(options)
        // 初始化模型
        mSearch.init(translatedOptions, {})
        mSearch.draw({
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
