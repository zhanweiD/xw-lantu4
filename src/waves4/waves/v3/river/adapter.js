import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import River from '../../../../waves-src/river'
import translate from './translate'

const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      const translatedOptions = translate(options)
      const instance = new River(translatedOptions)
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
        const {options: optionsData} = options
        const translatedOptions = translate(optionsData)
        const instance = new River(translatedOptions)
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

/**
 * 只允许定义指定hook的适配器类
 */
// const Adapter = k => createExhibitAdapter({
//   // 初始化组件实例
//   init(options) {
//     // 通过此配置判断是否显示面积
//     // options.hasRiver = false
//     // options.legendPosition = 'TITLE'
//     const translatedOptions = translate(options)
//     const instance = new River(translatedOptions)
//     instance.data(translatedOptions.data)
//     return instance
//   },
//   // 绘制组件
//   // NOTE: 不是所有的draw都是在画数据，也可能是动画或少量装饰
//   draw({instance}) {
//     instance.tagDatas = {
//       currentLoopQuery: this.apiStorage.currentLoopQuery,
//       apiLoopQueries: this.model.data.apiLoopQueries.toJSON().value,
//     }
//     instance.draw({
//       redraw: true,
//     })
//   },

//   destroy({instance}) {
//     instance.destroy()
//   },

//   addPoint() {

//   },

//   // 任何错误的处理
//   warn({instance, warn}) {
//     instance.warn(warn)
//   },

// })

// export default Adapter
