import {gisPoint, gisIcon, geojson, gisHeatmap, odLine, gisTile, gisTerrain, gisPath} from '../waves4/waves/gis/layers'

/**
 *
 * @param {[]} conditions 添加列表 {fieldName: 'key', fieldValue: '选项一', operator: '='}
 * @param {string} triggerCondition 'some'满足任意， 'every'满足全部
 * @return {boolean} 是否满足条件
 */
export const isMatchCondition = (conditions, triggerCondition, eventData) => {
  if (!conditions || !conditions.length) {
    return false
  }
  const {data} = eventData
  const result = conditions.map((cd) => {
    const {fieldName, fieldValue, operator} = cd
    return match(operator, data[fieldName], fieldValue)
  })
  if (triggerCondition === 'some') {
    return result.some((res) => res)
  }
  return result.every((res) => res)
}

function match(operator, v1, v2) {
  switch (operator) {
    case '=':
      return v1 === v2
    case '!=':
      return v1 !== v2
    case '>':
      return +v1 > +v2
    case '<':
      return +v1 < +v2
    case '>=':
      return +v1 >= +v2
    case '<=':
      return +v1 <= +v2
    case '包含':
      if (typeof v1 === 'string' || Array.isArray(v1)) {
        return v1.includes(v2)
      }
      return false
    case '不包含':
      if (typeof v1 === 'string' || Array.isArray(v1)) {
        return !v1.includes(v2)
      }
      return false
    default:
      return false
  }
}

export const setGisLayers = (config, gisLayers = []) => {
  if (config.key !== 'gis') {
    return config.layers
  }
  const modelLayers = [...config.layers]
  gisLayers.forEach((item) => {
    switch (item.type) {
      case 'gisPoint':
        modelLayers.push(gisPoint())

        // const option = gisPoint()
        // const pointLayer = new PointLayer({
        //   data: getRealData(item.data),
        // })
        // option.instanceLayer = pointLayer
        // modelLayers.push(option)
        break
      case 'gisIcon':
        modelLayers.push(gisIcon())
        break
      case 'geojson':
        modelLayers.push(geojson())
        break
      case 'gisHeatmap':
        modelLayers.push(gisHeatmap())
        break
      case 'odLine':
        modelLayers.push(odLine())
        break
      case 'gisTile':
        modelLayers.push(gisTile())
        break
      case 'gisTerrain':
        modelLayers.push(gisTerrain())
        break
      case 'gisPath':
        modelLayers.push(gisPath())
        break
      default:
        break
    }
  })
  return modelLayers
}
