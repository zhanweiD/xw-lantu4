import {Earth} from 'wave-map'
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import {newLayersInstance} from '@utils'
import translate from './translate'

/**
 * 只允许定义指定hook的适配器类
 */
const Adapter = () =>
  createExhibitAdapter({
    // 初始化组件实例
    init({options}) {
      const translatedOptions = translate(options)
      console.log(options)
      console.log(translatedOptions)
      const instance = new Earth(translatedOptions)
      // const layers = translatedOptions.layers.map((item) => item.instanceLayer?.getLayers())
      const config = {
        label: true,
        opacity: 1,
        earth: instance,
      }
      const layersInstance = newLayersInstance(config, translatedOptions.layers)
      instance.updateLayers(layersInstance, true)
      return instance
    },
    update(updateConfig) {
      const {instance, options} = updateConfig
      const config = {
        label: true,
        opacity: 1,
        earth: instance,
      }
      // 方法二 全部新建,不用考虑layer身上的instanceLayer
      const layersInstance = newLayersInstance(config, options.layers)
      instance.updateLayers(layersInstance, true)

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
      //     updateLayer?.instanceLayer?.updateProps(updated.options)
      //   }
      //   // const updateOption = updateLayer?.instanceLayer?.getLayers()
      //   const layers = options.layers.map(item => item.instanceLayer.getLayers())
      //   // 因为setData后页面未更新，这里再次调用updateLayers更新页面
      //   instance.updateLayers(layers, true)
      // } else {
      //   // 更新map props
      //   instance.updateProps(options)
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
