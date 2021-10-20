import {createWave} from '@waveview/wave'
import {layerOptionMap, layerTypeMap} from './mapping'
import translate from './translate'

// 删除无效值，因为无效值有特殊含义（采用默认值）
const filterInvalid = (object) => {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'object') {
      object[key] = filterInvalid(object[key])
    }
    if (object[key] === undefined) {
      delete object[key]
    }
  })
  return object
}

// 初始化图表
const reinitializeWave = (wave, options) => {
  wave.destroy()
  createWave(translate(options), wave)
}

// 根据配置更新一个图表
const updateStyle = ({
  action,
  instance,
  options,
  updated,
  updatedPath,
  // updatedLayer,
  // updatedAxis,
  // updatedLegend,
  // updatedTitle,
  // updatedOther,
}) => {
  // 层映射修改即数据修改，重绘
  if (updatedPath === 'dataMap.column') {
    reinitializeWave(instance, options)
    return
  }
  let target = null
  // 层在图表库里的类型
  let type = layerTypeMap.get(action) || action
  // if (action === 'layer') {
  //   target = updatedLayer
  // } else if (action === 'axis') {
  //   target = updatedAxis
  // } else if (action === 'legend') {
  //   target = updatedLegend
  // } else if (action === 'title') {
  //   target = updatedTitle
  // } else if (action === 'other') {
  //   target = updatedOther
  // }
  target = updated
  // 层实例
  let layer = null
  if (action === 'layer') {
    const waveLayer = instance.layers.find((item) => item.id === target.id)
    layer = waveLayer.instance
    type = waveLayer.type
  } else {
    layer = instance.layers.find((item) => item.type === type).instance
  }
  const {mapOption, getOption} = target
  const config = layerOptionMap.get(type)({mapOption, getOption})
  const newOptions = filterInvalid(config)
  // 层 options 影响全局，scale 影响数据，需要重绘
  if (
    (newOptions.scale && Object.keys(newOptions.scale).length) ||
    (newOptions.options && Object.keys(newOptions.options).length)
  ) {
    reinitializeWave(instance, options)
  } else {
    if (newOptions.data) {
      layer.setData(newOptions.data, {})
    }
    layer.setStyle(newOptions.style)
    layer.draw()
  }
}

// 图表更新策略
const updateWave = (schema) => {
  try {
    const {action, instance, options, updated} = schema
    if (action === 'data' || action === 'dimension' || action === 'other') {
      if (action === 'other') {
        instance.setPadding(updated.getOption('layout.areaOffset'))
      }
      reinitializeWave(instance, options)
    } else {
      updateStyle(schema)
    }
  } catch (error) {
    console.error('图层配置解析错误，更新失败', error)
  }
}

export default updateWave
