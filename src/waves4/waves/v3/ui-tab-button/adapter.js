/*
 * @Author: zhanwei
 * @Date: 2022-06-21 15:51:01
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-06-29 16:27:23
 * @Description:
 */
import createExhibitAdapter from '@exhibit-collection/exhibit-adapter-creater'
import MTabButton from '@wavesSrc/ui-tab-button'
import {layerOptionMap} from './mapping'

const translate = (config) => {
  const newData = [...config.data]
  const {options} = config.layers[0]
  const keys = options.dataMap ? [...options.dataMap.column] : ''
  const index = newData[0].findIndex((item) => item === keys[0])

  return newData.slice(1).map((item) => ({[keys[0]]: item[index]}))
}

/**
 * react hook 组件适配器
 */
const Adapter = () =>
  createExhibitAdapter({
    // 初始化
    init({options, event}) {
      const mTabButton = MTabButton.create({options: translate(options)})
      const {getOption, mapOption} = options.layers[0]
      const config = layerOptionMap.get('layer')({getOption, mapOption})

      // 初始化模型
      mTabButton.init({...options, ...config}, {})
      mTabButton.draw({
        redraw: false,
      })
      mTabButton.event.on('onSwitchButton', (info) => {
        event.fire('switchPanel', info)
      })
      return mTabButton
    },

    // 配置组件数据
    update({instance, options}) {
      const {getOption, mapOption} = options.layers[0]
      const config = layerOptionMap.get('layer')({getOption, mapOption})
      console.log(config)
      // 初始化模型
      instance.data(translate(options))
      instance.init({...options, ...config}, {})
      instance.draw({
        redraw: true,
      })
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
