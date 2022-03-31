import {layerOptionMap} from './mapping'

function translate(schema) {
  const {
    width, // 容器宽
    height, // 容器高
    // data, // 数据
    container, // 容器必传
    padding, // 内边距
    layers, // 图层配置
    gisBase,
    themeColors = ['#2A43FF', '#0B78FF', '#119BFF', '#3EBFDA', '#6CDDC3', '#B5E4AA', '#FFEA92', '#FFBD6D', '#FD926D'], // 主题颜色
  } = schema

  // 适用于 V3 组件直接迁移过来的
  // 每个组件需要的参数要自己处理，和 V4 组件的适配不同
  const configs = []
  layers.forEach((item) => {
    const {getOption, mapOption} = item
    switch (item.type) {
      case 'gis':
        configs.push({...item, ...layerOptionMap.get('gis')({getOption, mapOption})})
        break
      case 'gisPoint':
        configs.push({...item, ...layerOptionMap.get('gisPoint')({getOption, mapOption})})
        break
      case 'gisHeatmap':
        configs.push({...item, ...layerOptionMap.get('gisHeatmap')({getOption, mapOption})})
        break
      case 'odLine':
        configs.push({...item, ...layerOptionMap.get('odLine')({getOption, mapOption})})
        break
      default:
        break
    }
  })

  // const {getOption, mapOption} = layers[0]
  // // 属性的转换
  // const config = layerOptionMap.get('layer')({getOption, mapOption})
  // config.data = getRealData(data)
  return {
    width,
    height,
    container,
    padding,
    theme: themeColors,
    themeColors,
    tooltip: {position: 'relative'},
    adjust: false,
    layers: configs,
    ...gisBase,
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
