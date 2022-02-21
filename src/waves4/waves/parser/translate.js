import uuid from '@utils/uuid'
import {merge, isObject} from 'lodash'
import {layerOptionMap, layerTypeMap} from './mapping'

const getRealData = (dataSource, keys) => {
  try {
    if (!dataSource || !keys) {
      return null
    }
    const headers = dataSource[0]
    const indexs = keys.map((key) => headers.findIndex((value) => value === key))
    return dataSource.map((row) => indexs.map((index) => row[index]))
  } catch (e) {
    console.error('数据解析失败', {dataSource, keys})
    return []
  }
}

// 工具配置到图表配置的映射函数
function translate(schema) {
  const {
    width, // 容器宽
    height, // 容器高
    container, // 容器必传
    dimension, // 数据维度
    data, // 列表数据
    layers, // 图层配置
    legend, // 图例图层配置
    title, // 标题配置
    axis, // 坐标轴配置
    polar, // 极坐标
    other, // 其他配置
    themeColors = ['#2A43FF', '#0B78FF', '#119BFF', '#3EBFDA', '#6CDDC3', '#B5E4AA', '#FFEA92', '#FFBD6D', '#FD926D'], // 主题颜色
  } = schema

  let layerConfig = []
  let padding = [60, 40, 40, 40] // 内边距

  if (other && isObject(other) && Object.keys(other).length) {
    padding = other.getOption('layout.areaOffset')
  }

  // 处理图层配置
  layers.forEach(({id, options, getOption, mapOption, type, effective}) => {
    if (effective || effective === undefined) {
      const layerType = layerTypeMap.get(type) || type
      const keys = [...dimension.xColumn, ...options.dataMap.column]
      const config = layerOptionMap.get(layerType)({getOption, mapOption})
      layerConfig.push(
        merge(
          {
            type: layerType,
            data: getRealData(data, keys),
            options: {id, layout: 'main'},
          },
          config
        )
      )
    }
  })

  // 手动追加标题层
  if (title && isObject(title) && Object.keys(title).length) {
    const {getOption, mapOption} = title
    const config = layerOptionMap.get('text')({getOption, mapOption})
    layerConfig.push(
      merge(
        {
          type: 'text',
          options: {
            id: uuid(),
            layout: 'title',
          },
        },
        config
      )
    )
  }

  // 手动追加图例层
  if (legend && isObject(legend) && Object.keys(legend).length) {
    const {getOption, mapOption} = legend
    const config = layerOptionMap.get('legend')({getOption, mapOption})
    layerConfig.push(
      merge(
        {
          type: 'legend',
          options: {
            id: uuid(),
            layout: 'legend',
          },
        },
        config
      )
    )
  }

  // 手动追加坐标轴层
  if (axis && isObject(axis) && Object.keys(axis).length) {
    const {getOption, mapOption} = axis
    const config = layerOptionMap.get('axis')({getOption, mapOption})
    layerConfig.push(
      merge(
        {
          type: 'axis',
          options: {
            id: uuid(),
            layout: 'main',
          },
        },
        config
      )
    )
  }

  if (polar && isObject(polar) && Object.keys(polar).length) {
    const {getOption, mapOption} = polar
    const config = layerOptionMap.get('polar')({getOption, mapOption})

    // 极坐标的配置项和直角坐标的配置项类似
    layerConfig.push(
      merge(
        {
          type: 'axis',
          options: {
            type: 'polar',
            id: uuid(),
            layout: 'main',
          },
        },
        config
      )
    )
  }

  return {
    width,
    height,
    container,
    padding,
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
