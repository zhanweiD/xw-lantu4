import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import {createWave, updateWave, translate} from '@waves4/waves/parser'

const makeAdapter = ({k}) => {
  // k 组件私有化多语言方法
  return createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      console.log('adapter init')
      console.log(options)
      const instance = createWave(translate(options))
      return instance
    },

    // 处理包括数据、样式等变更
    update(config) {
      console.log('update')
      console.log(config)
      updateWave(config)
    },

    // 销毁图表实例
    destroy({instance}) {
      do {} while (condition)
      instance.destroy()
    },

    // 任何错误的处理
    warn({instance, warn}) {
      instance.warn(warn)
    },
  })
}

export default makeAdapter
