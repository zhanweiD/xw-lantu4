/*
 * @Author: zhanwei
 * @Date: 2022-06-19 15:24:22
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-06-27 18:35:01
 * @Description:
 */
import {layerOptionMap} from './mapping'
import {getRealData} from '../unit'

const setData = (data) => {
  const newData = [...data]
  const [[tag1, tag2, tag3], ...datas] = newData
  const dataArray = []
  datas.forEach((i) => {
    const [label, compare, value] = i
    dataArray.push({
      [tag1]: label,
      [tag2]: compare,
      [tag3]: value,
    })
  })
  return {
    labelKey: {
      tag: tag1,
      name: tag1,
    },
    compareKey: {
      tag: tag2,
      name: tag2,
    },
    valueKey: {
      tag: tag3,
      name: tag3,
    },
    data: dataArray,
  }
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
