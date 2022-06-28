import {layerOptionMap} from './mapping'
import {getRealData} from '../unit'

const setData = (data) => {
  const newData = [...data]
  const dataObj = {
    label: [],
    value: [],
  }
  const fields = newData.shift()
  fields.forEach((item, i) => {
    if (i === 0) {
      dataObj.label = newData.map((v) => v[0])
    } else {
      dataObj.value.push({
        name: item,
        data: newData.map((v) => v[i]),
      })
    }
  })
  return dataObj
}

function translate(schema) {
  const {
    width, // 容器宽
    height, // 容器高
    data, // 数据
    container, // 容器必传
    padding, // 内边距
    layers, // 图层配置
    dimension,
    themeColors = ['#2A43FF', '#0B78FF', '#119BFF', '#3EBFDA', '#6CDDC3', '#B5E4AA', '#FFEA92', '#FFBD6D', '#FD926D'], // 主题颜色
  } = schema
  // 适用于 V3 组件直接迁移过来的
  // 每个组件需要的参数要自己处理，和 V4 组件的适配不同
  const {getOption, mapOption, options} = layers[0]
  // 属性的转换
  const config = layerOptionMap.get('layer')({getOption, mapOption})
  const keys = dimension && options.dataMap ? [...dimension.xColumn, ...options.dataMap.column] : ''
  config.data = getRealData(setData, data, keys)

  return {
    width,
    height,
    container,
    padding,
    theme: themeColors,
    themeColors,
    tooltip: {position: 'relative'},
    adjust: false,
    ...config,
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
