import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import {createWave, translate} from '@materials/decoration/parser'

const makeAdapter = () => {
  // k 组件私有化多语言方法
  return createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      const instance = createWave(translate(options))
      return instance
    },

    // 处理包括数据、样式等变更
    update({options, instance}) {
      instance.destroy()
      createWave(translate(options), instance)
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
}

export default makeAdapter
