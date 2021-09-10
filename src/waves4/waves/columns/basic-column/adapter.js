import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init(options) {
      console.log(JSON.stringify(options, null, 4))
      // const instance = createWave(translate(options))
      // return instance
    },

    // 处理包括数据、样式等变更
    update(options) {
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
