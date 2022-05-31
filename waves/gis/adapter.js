// import {Earth} from 'wave-map/src/index'
import {Earth} from 'wave-map'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import {newLayersInstance} from '@utils'
// import {newLayersInstance, getRealData} from '@utils'
import translate from './translate'

/**
 * 只允许定义指定hook的适配器类
 */
const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      const translatedOptions = translate(options)
      console.log(translatedOptions)
      const instance = new Earth(translatedOptions)

      // const layers = translatedOptions?.layers?.map(layer => layer.instanceLayer.getLayers())
      // const instance = new Earth({...translatedOptions, layers})
      // const layers = translatedOptions.layers.map((item) => item.instanceLayer?.getLayers())

      const layersInstance = newLayersInstance(instance, translatedOptions.layers)
      instance.updateProps({layers: layersInstance})
      return instance
    },

    update(updateConfig) {
      console.log(updateConfig)
      const {instance, options, updated} = updateConfig
      const isLayer = options.layers.find((item) => item.id === updated.id)
      const layersInstance = newLayersInstance(updateConfig.instance, options.layers)
      if (isLayer) {
        // 方法二 全部新建,不用考虑layer身上的instanceLayer
        instance.updateProps({layers: layersInstance})
      } else {
        instance.updateProps({...translate(options), layers: layersInstance})
        // 方式二新建map，工具条之类的需要重新创建
        // instance.destory()
        // const newInstance = new Earth(translate(options))
        // const config = {
        //   label: true,
        //   opacity: 1,
        //   earth: newInstance,
        // }
        // const layersInstance = newLayersInstance(config, options.layers)
        // newInstance.updateLayers(layersInstance, true)
        // return newInstance
      }

      // 方法一，流程暂时走不通 diff更新
      // 找到修改的layer,有就是layers层更新，没有就是map-box更新
      // const updateLayer = options.layers.find((item) => item.id === updated.id)
      // if (updateLayer) {
      //   // 是否是更新数据
      //   if (updated.options.data) {
      //     const data = getRealData(updated.options.data)
      //     // 设置数据，看了map库更新了数据会掉updateLayer，但实际页面数据没更新（待排查）
      //     updateLayer?.instanceLayer?.setData(data)
      //   } else {
      //     // 更新style
      //     updateLayer?.instanceLayer?.updateProps(updated.options.base)
      //   }
      //   // const updateOption = updateLayer?.instanceLayer?.getLayers()
      //   const layers = options.layers.map(item => item.instanceLayer.getLayers())
      //   // 因为setData后页面未更新，这里再次调用updateLayers更新页面
      //   instance.updateProps({layers}, true)
      // } else {
      //   // 更新map props
      //   instance.updateProps(options.gisBase)
      // }
    },

    // 销毁  v4用destroy,map组件用destory巨坑，都是销毁意思错一个字母
    destroy({instance}) {
      instance.destory()
    },

    // 任何错误的处理
    warn({instance, warn}) {
      instance.warn(warn)
    },
  })

export default Adapter
