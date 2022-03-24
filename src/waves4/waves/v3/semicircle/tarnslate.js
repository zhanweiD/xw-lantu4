import {layerOptionMap} from './mapping'

const getRealData = (dataSource) => {
  try {
    if (!dataSource) {
      return {}
    }
    // 数据结构赋值
    const [[tag1, tag2, tag3], [label1, label2, label3], ...datas] = dataSource
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
        name: label1,
      },
      compareKey: {
        tag: tag2,
        name: label2,
      },
      valueKey: {
        tag: tag3,
        name: label3,
      },
      data: dataArray,
    }
  } catch (e) {
    console.error('数据解析失败', {dataSource})
    return {}
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
  //   config.data = getRealData(data)
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
