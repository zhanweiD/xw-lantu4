// import {
//   PointLayer,
//   // IconLayer,
//   TerrainLayer,
//   HeatmapLayer,
//   // TileLayer,
//   // GeoJsonLayer,
//   // PathLayer,
//   OdLineLayer,
// } from 'wave-map-test'
import {
  PointLayer,
  // IconLayer,
  TerrainLayer,
  HeatmapLayer,
  // TileLayer,
  // GeoJsonLayer,
  PathLayer,
  OdLineLayer,
} from 'wave-map-test'
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
      const dataItem = {}
      dataSource[0].forEach((item, index) => {
        dataItem[dataSource[0][index]] = i[index]
      })
      dataArray.push(dataItem)
      // dataArray.push({
      //   [dataSource[0][0]]: i[0],
      //   [dataSource[0][1]]: i[1],
      //   [dataSource[0][2]]: i[2],
      //   [dataSource[0][3]]: i[3],
      // })
    })
    return dataArray
  } catch (e) {
    console.error('数据解析失败', {dataSource})
    return []
  }
}

// 'rgba(255,255,255,1)' --> [255,255,255(,1)]
const arrayRgba = (rgba) => {
  const color = rgba.split(',').map((item, index) => {
    if (!index) return +item.split('(')[1]
    if (index === 3) return +item.split(')')[0]
    return +item
  })
  color.length = 3
  return color
}

const newLayersInstance = (earth, layers) => {
  const data = layers.map((item) => {
    const layer = item.getSchema ? item.getSchema() : item
    const layerOptions = layer.options.sections ? layer.options.sections.base.fields : layer.options.base
    let instance
    switch (layer.type) {
      case 'gisPoint':
        layerOptions.labelColor = arrayRgba(layerOptions.labelColor)
        layerOptions.getLineColor = arrayRgba(layerOptions.lineColor)
        layerOptions.getFillColor = [...arrayRgba(layerOptions.fillColor), 255]
        // !layerOptions.diskResolution && delete layerOptions.diskResolution
        instance = new PointLayer({
          ...layerOptions,
          earth,
          data: getRealData(layer.data),
        }).getLayers()
        break
      case 'gisHeatmap':
        console.log(layerOptions)
        instance = new HeatmapLayer({
          ...layerOptions,
          earth,
          data: getRealData(layer.data),
        }).getLayers()
        break
      case 'odLine':
        layerOptions.getSourceColor = arrayRgba(layerOptions.getSourceColor)
        layerOptions.sourcePointColor = arrayRgba(layerOptions.sourcePointColor)
        layerOptions.sourceLabelColor = arrayRgba(layerOptions.sourceLabelColor)
        layerOptions.getTargetColor = arrayRgba(layerOptions.getTargetColor)
        layerOptions.targetPointColor = arrayRgba(layerOptions.targetPointColor)
        layerOptions.targetLabelColor = arrayRgba(layerOptions.targetLabelColor)
        // layerOptions.flyPointColor = arrayRgba(layerOptions.flyPointColor)
        console.log(layerOptions)
        instance = new OdLineLayer({
          ...layerOptions,
          // setFlyPoint: true,
          // setFlyPointWidth: 10,
          // setFlyPointSize: 10,
          // setFlyPointColor: [255, 255, 255, 1],
          earth,
          data: getRealData(layer.data),
        }).getLayers()
        break
      case 'gisTerrain':
        layerOptions.elevationDecoder = {
          rScaler: layerOptions.elevationDecoder?.[0],
          gScaler: layerOptions.elevationDecoder?.[1],
          bScaler: layerOptions.elevationDecoder?.[2],
          offset: layerOptions.elevationDecoder?.[3],
        }
        instance = new TerrainLayer({
          ...layerOptions,
          earth,
          // data: getRealData(layer.data),
        }).getLayers()
        break
      case 'gisPath':
        layerOptions.endVertexColor = arrayRgba(layerOptions.endVertexColor)
        layerOptions.pathColor = arrayRgba(layerOptions.pathColor)
        layerOptions.trailColor = arrayRgba(layerOptions.trailColor)
        layerOptions.vertexColor = arrayRgba(layerOptions.vertexColor)
        console.log(layerOptions)
        instance = new PathLayer({
          ...layerOptions,
          earth,
          data: getRealData(layer.data),
        }).getLayers()
        break
      default:
        break
    }
    return instance
  })
  // console.log(data.flat())
  return data
}
export {newLayersInstance, getRealData}
