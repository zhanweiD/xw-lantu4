// import Xt from 'xt-earth/Earth'
// import {toJS} from 'mobx'
// import debounce from 'lodash/debounce'
// import cloneDeep from 'lodash/cloneDeep'
import {Earth} from 'wave-map/src/index'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import translate from './translate'

// const getRealData = (dataSource) => {
//   try {
//     if (!dataSource) {
//       return []
//     }
//     const dataArray = []
//     dataSource.forEach((i, idx) => {
//       if (idx === 0) return
//       dataArray.push({
//         [dataSource[0][0]]: i[0],
//         [dataSource[0][1]]: i[1],
//         [dataSource[0][2]]: i[2],
//         [dataSource[0][3]]: i[3],
//       })
//     })
//     return dataArray
//   } catch (e) {
//     console.error('数据解析失败', {dataSource})
//     return []
//   }
// }

/**
 * 只允许定义指定hook的适配器类
 */
const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      const translatedOptions = translate(options)
      const layers = translatedOptions.layers.map((item) => item.instanceLayer?.getLayers())
      const instance = new Earth({...translatedOptions, layers})
      return instance
    },
    update(updateConfig) {
      const {updated, instance, options} = updateConfig
      const updateLayer = options.layers.find((item) => item.id === updated.id)
      if (updateLayer) {
        // if (updated.options.data) {
        //   updateLayer?.instanceLayer?.setData(getRealData(updated.options.data))
        // } else {
        //   updateLayer?.instanceLayer?.updateProps(updated.options)
        // }
        instance.updateLayers([updateLayer?.instanceLayer?.getLayers()], false)
      } else {
        instance.updateProps(options)
      }
      console.log(updateConfig, instance)
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
