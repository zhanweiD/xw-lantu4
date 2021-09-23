import uuid from '@utils/uuid'
import {merge} from 'lodash'
import {layerOptionMap, layerTypeMap} from './mapping'

const getRealData = (dataSource, keys) => {
  if (!dataSource || !keys) {
    return null
  }
  const headers = dataSource[0]
  const indexs = keys.map((key) => headers.findIndex((value) => value === key))
  return dataSource.map((row) => indexs.map((index) => row[index]))
}

// 工具配置到图表配置的映射函数
function translate(schema) {
  const {
    width, // 容器宽
    height, // 容器高
    container, // 容器必传
    themeColors, // 主题颜色
    dimension, // 数据维度
    data, // 列表数据
    layers, // 图层配置
    legend, // 图例图层配置
    title, // 标题配置
    axis, // 坐标轴配置
    padding = [60, 40, 40, 40], // 内边距
  } = schema

  let layerConfig = []

  // 处理图层配置
  layers.forEach(({id, options, getOption, mapOption, type, effective}) => {
    if (effective || effective === undefined) {
      const layerType = layerTypeMap.get(type)
      const keys = [...dimension.xColumn, ...options.dataMap.column]
      const config = layerOptionMap.get(layerType)({getOption, mapOption})
      layerConfig.push(
        merge(config, {
          type: layerType,
          data: getRealData(data, keys),
          options: {id, axis: 'main', layout: 'main'},
        })
      )
    }
  })

  // 手动追加标题层
  if (title) {
    const {getOption, mapOption} = title
    const config = layerOptionMap.get('text')({getOption, mapOption})
    layerConfig.push(
      merge(config, {
        type: 'text',
        options: {
          id: uuid(),
          layout: 'title',
        },
      })
    )
  }

  // 手动追加图例层
  if (legend) {
    const {getOption, mapOption} = legend
    const config = layerOptionMap.get('legend')({getOption, mapOption})
    layerConfig.push(
      merge(config, {
        type: 'legend',
        options: {
          id: uuid(),
          layout: 'legend',
        },
      })
    )
  }

  // 手动追加坐标轴层
  if (axis) {
    const {getOption, mapOption} = axis
    const config = layerOptionMap.get('axis')({getOption, mapOption})
    layerConfig.push(
      merge(config, {
        type: 'axis',
        options: {
          id: uuid(),
          layout: 'main',
        },
      })
    )
  }

  return {
    width,
    height,
    padding,
    container,
    theme: themeColors,
    tooltip: {position: 'relative'},
    layers: layerConfig.reverse(),
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
