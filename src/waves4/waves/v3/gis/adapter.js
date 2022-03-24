// import Xt from 'xt-earth/Earth'
// import {toJS} from 'mobx'
// import debounce from 'lodash/debounce'
// import cloneDeep from 'lodash/cloneDeep'
// import {Earth} from 'wave-map'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
// import createEvent from '@common/event'
import translate from './translate'

/**
 * 只允许定义指定hook的适配器类
 */
const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      console.log(options)
      const translatedOptions = translate(options)
      // const instance = new Earth({
      //   container: options.container,
      //   showMapHelper: true
      // })
      // console.log(instance)
      console.log(translatedOptions)
    },
    update(updateConfig) {
      const {updated} = updateConfig
      const {options} = updated || {}
      console.log(updateConfig)
      console.log(options[Object.keys(options)[0]])
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
