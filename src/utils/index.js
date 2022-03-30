import {
  PointLayer,
  // IconLayer,
  // TerrainLayer,
  HeatmapLayer,
  // TileLayer,
  // GeoJsonLayer,
  // PathLayer,
  // OdLineLayer
} from 'wave-map'
import hJSON from 'hjson'

const getRealData = (data) => {
  let dataSource = data
  if (data.type === 'private') {
    dataSource = hJSON.parse(data.private)
  }
  try {
    if (!dataSource) {
      return []
    }
    const dataArray = []
    dataSource.forEach((i, idx) => {
      if (idx === 0) return
      dataArray.push({
        [dataSource[0][0]]: i[0],
        [dataSource[0][1]]: i[1],
        [dataSource[0][2]]: i[2],
        [dataSource[0][3]]: i[3],
      })
    })
    return dataArray
  } catch (e) {
    console.error('数据解析失败', {dataSource})
    return []
  }
}

const newLayersInstance = (config, layers, type) => {
  return layers.map((item) => {
    let data
    switch (item.type) {
      case 'gisPoint':
        data = new PointLayer({
          ...config,
          data: type ? getRealData(item.data.getValue()) : getRealData(item.data),
        }).getLayers()
        break
      case 'gisHeatmap':
        data = new HeatmapLayer({
          ...config,
          data: type ? getRealData(item.data.getValue()) : getRealData(item.data),
        }).getLayers()
        break
      default:
        break
    }
    return data
  })
}
export {newLayersInstance, getRealData}
