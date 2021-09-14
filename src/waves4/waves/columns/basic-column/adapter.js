import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import {createWave, translate} from '@waves4/waves/parser'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init(options) {
      console.log('adapter init')
      console.log(options)
      const instance = createWave(translate(options))
      return instance
    },

    // 处理包括数据、样式等变更
    update(options) {
      console.log('update')
      console.log(options)
      // updateWave(options)
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
