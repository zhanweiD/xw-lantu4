import {layerOptionMap} from './mapping'
const getRealData = (dataSource) => {
  try {
    if (!dataSource) {
      return {}
    }
    const obj = {}
    obj.label = []
    obj.value = []

    dataSource[0]?.map((v, i) => {
      obj.label.push({
        id: `label${i}`,
        name: v,
      })
    })

    const l = 'label'

    dataSource?.map((m, ind) => {
      ind !== 0 &&
        dataSource[0]?.map((v, i) => {
          i / 3 === 0 &&
            obj.value.push({
              [l + i]: m[i],
              [l + (i + 1)]: m[i + 1],
              [l + (i + 2)]: m[i + 2],
              [l + (i + 3)]: m[i + 3],
              [l + (i + 4)]: m[i + 4],
              [l + (i + 5)]: m[i + 5],
              [l + (i + 6)]: m[i + 6],
              [l + (i + 7)]: m[i + 7],
              [l + (i + 8)]: m[i + 8],
              [l + (i + 9)]: m[i + 9],
              [l + (i + 10)]: m[i + 10],
              [l + (i + 11)]: m[i + 11],
              [l + (i + 12)]: m[i + 12],
              [l + (i + 13)]: m[i + 13],
              [l + (i + 14)]: m[i + 14],
              [l + (i + 15)]: m[i + 15],
              [l + (i + 16)]: m[i + 16],
              [l + (i + 17)]: m[i + 17],
              [l + (i + 18)]: m[i + 18],
            })
        })
    })

    return obj
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
  const {getOption, mapOption} = layers[0]
  // 属性的转换
  const config = layerOptionMap.get('layer')({getOption, mapOption})
  config.data = getRealData(data)
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
