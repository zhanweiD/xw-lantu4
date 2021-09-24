import {merge} from 'lodash'
import {layerOptionMap, layerTypeMap} from './mapping'

// 工具配置到图表配置的映射函数
function translate(schema) {
  const {
    width, // 容器宽
    height, // 容器高
    container, // 容器必传
    themeColors, // 主题颜色
    layers, // 图层配置
    padding, // 内边距
  } = schema

  let layerConfig = []

  // 处理图层配置
  layers.forEach(({id, getOption, mapOption, type, effective}) => {
    if (effective || effective === undefined) {
      const layerType = layerTypeMap.get(type)
      const config = layerOptionMap.get(layerType)({getOption, mapOption})
      layerConfig.push(
        merge(config, {
          type: layerType,
          options: {id, axis: 'main', layout: 'main'},
        })
      )
    }
  })

  return {
    width,
    height,
    padding,
    container,
    theme: themeColors,
    layers: [],
    adjust: false,
  }
}

export default (...parameter) => {
  try {
    return translate(...parameter)
  } catch (error) {
    console.error('图表解析失败', error)
    return null
  }
}
