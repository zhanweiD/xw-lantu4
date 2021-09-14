import {Data} from '@waveview/wave'
import {layerTypeMap, mapLayerOption} from './mapping'
import {merge} from 'lodash'

const getRealData = (dataSource, mappingValues) => {
  if (!dataSource || !mappingValues) return null
  // 解析数据源格式，取数据
  const dataSet = Object.keys(mappingValues).map((groupId) => {
    const {fields, sourceId} = mappingValues[groupId]
    return fields.map(({value}) =>
      value.map(({key}) => {
        const targetIndex = dataSource[sourceId][0].findIndex((header) => header === key)
        return dataSource[sourceId].map((item) => item[targetIndex])
      })
    )
  })
  // 拼接数据
  const dataBase = new Data.Base()
  const tableLists = dataSet.map((item) => dataBase.transpose(item.reduce((prev, cur) => [...prev, ...cur])))
  return tableLists.length === 1 ? tableLists[0] : tableLists
}

// 工具配置到图表配置的映射函数
function translate(schema) {
  const {
    width, // 容器宽
    height, // 容器高
    padding, // 内边距
    container, // 容器必传
    themeColors, // 主题颜色
    baseFontSize, // 文字缩放系数
    coordinate, // 坐标轴类型
    layers, // 图层配置
    isPreview, // 是否预览
    data, // 字符串数据
  } = schema

  // 处理图层配置
  const layerConfig = layers.map(({id, name, data, options, type}) => {
    const _type = layerTypeMap.get(type)
    const _options = {id, axis: 'main', layout: 'main'}
    const _scale = {count: 5}
    const _style = {}
    let _data = {
      type: 'tableList',
      mode: 'normal',
      row: 6,
      column: 3,
      mu: 500,
      sigma: 200,
      decimalPlace: 1,
    }
    return merge(mapLayerOption(options, _type), {
      type: _type,
      data: _data,
      scale: _scale,
      style: _style,
      options: _options,
    })
  })

  // 手动加入坐标轴层
  layerConfig.push({
    type: 'axis',
    options: {
      id: 'axis',
      layout: 'main',
    },
    scale: {
      zero: true,
    },
  })

  return {
    width,
    height,
    padding,
    container,
    coordinate,
    baseFontSize,
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
