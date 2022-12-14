/*
 * @Author: zhanwei
 * @Date: 2022-06-21 15:51:01
 * @LastEditors: zhanwei
 * @LastEditTime: 2022-06-30 17:18:18
 * @Description:
 */
import {layerOptionMap} from './mapping'
import {getRealData} from '../unit'

const setData = (dataSource) => {
  const newData = [...dataSource]
  try {
    if (!dataSource) {
      return {}
    }
    const translateOptionArr = []
    newData?.forEach((v, i) => {
      if (i > 0) {
        translateOptionArr.push({
          key: v[0],
          value: v[1] || v[0],
        })
      }
    })
    return translateOptionArr
  } catch (e) {
    console.error('数据解析失败', {dataSource})
    return []
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
    themeColors = ['#2A43FF', '#0B78FF', '#119BFF', '#3EBFDA', '#6CDDC3', '#B5E4AA', '#FFEA92', '#FFBD6D', '#FD926D'], // 主题颜色
  } = schema

  // 适用于 V3 组件直接迁移过来的
  // 每个组件需要的参数要自己处理，和 V4 组件的适配不同
  const {getOption, mapOption, options} = layers[0]
  // 属性的转换
  const config = layerOptionMap.get('layer')({getOption, mapOption})
  const keys = options.dataMap ? [...options.dataMap.column] : ''
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
    keys: ['一级分类'],
    activeKeys: ['一级分类'],
    // defaultOptions: {
    //   一级分类: '浙江省',
    // },
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
