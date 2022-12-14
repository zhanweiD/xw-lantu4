import {
  PointLayer,
  IconLayer,
  TerrainLayer,
  HeatmapLayer,
  TileLayer,
  GeoJsonLayer,
  PathLayer,
  OdLineLayer,
} from 'wave-map'
// import {
//   PointLayer,
//   IconLayer,
//   TerrainLayer,
//   HeatmapLayer,
//   TileLayer,
//   GeoJsonLayer,
//   PathLayer,
//   OdLineLayer,
// } from 'wave-map/src/index'
import hJSON from 'hjson'
import chroma from 'chroma-js'

// rgba-->16进制
const hexify = (color) => {
  var values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',')
  var a = parseFloat(values[3] || 1),
    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
  return '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2)
}

/** 颜色比例尺
 * @param v 渐变色数组 [['rgba(74,144,226,1)', 0],['rgba(80,227,194,1)', 1]]
 * @param n getColor所需颜色数量
 */
const chromaScale = (v, n) => {
  const colors = v.map((o) => o[0])
  const domain = v.map((o) => o[1])
  const scaleMap = {}
  Array.from({length: n}, (x, i) => i).forEach((x) => {
    const {_rgb} = chroma.scale(colors).domain(domain)(x / (n > 1 ? n - 1 : 1))
    scaleMap[x] = `rgba(${_rgb[0]}, ${_rgb[1]}, ${_rgb[2]}, ${_rgb[3]})`
  })
  const rgbaColors = Object.values(scaleMap)
  return rgbaColors.map((item) => hexify(item))
}

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
  return layers.map((item) => {
    const layer = item.getSchema ? item.getSchema() : item
    const layerOptions = layer.options.sections ? layer.options.sections.base.fields : layer.options.base
    let instance
    switch (layer.type) {
      case 'gisPoint':
        layerOptions.labelColor = arrayRgba(layerOptions.labelColor)
        layerOptions.getLineColor = arrayRgba(layerOptions.lineColor)
        layerOptions.getFillColor = [...arrayRgba(layerOptions.fillColor), 255]

        instance = new PointLayer({
          ...layerOptions,
          earth,
          data: getRealData(layer.data),
        }).getLayers()
        break
      case 'gisHeatmap':
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
        instance = new OdLineLayer({
          ...layerOptions,
          // flyPoint: true,
          // getHeight: 1,
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

        instance = new PathLayer({
          ...layerOptions,
          earth,
          data: getRealData(layer.data),
        }).getLayers()
        break
      case 'gisIcon':
        layerOptions.labelColor = arrayRgba(layerOptions.labelColor)
        layerOptions.getLabel = (d) => d.name
        layerOptions.getLabelPosition = (d) => d.coordinates

        instance = new IconLayer({
          ...layerOptions,
          earth,
          data: getRealData(layer.data),
        }).getLayers()
        break
      case 'geojson':
        layerOptions.labelColor = arrayRgba(layerOptions.labelColor)
        layerOptions.getFillColor = arrayRgba(layerOptions.getFillColor)
        layerOptions.getLineColor = arrayRgba(layerOptions.getLineColor)
        layerOptions.getLabel = (d) => d.label
        layerOptions.getLabelPosition = (d) => d.center
        layerOptions.data = layerOptions.geojsonData

        instance = new GeoJsonLayer({
          earth,
          labelData: getRealData(layer.data),
          ...layerOptions,
          getElevation: (d) => {
            return layerOptions.geojsonType === 'city'
              ? Number(d.properties.FLOOR) * 3
              : Number(d.properties.childrenNum) * 3000
          },
          // getFillColor: () => [200 * Math.random(), 30, 40],
        }).getLayers()
        break
      default:
        layerOptions.loadOptions =
          layerOptions.tileType === 'cesium'
            ? {
                'cesium-ion': {
                  accessToken:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWMxMzcyYy0zZjJkLTQwODctODNlNi01MDRkZmMzMjIxOWIiLCJpZCI6OTYyMCwic2NvcGVzIjpbImFzbCIsImFzciIsImdjIl0sImlhdCI6MTU2Mjg2NjI3M30.1FNiClUyk00YH_nWfSGpiQAjR5V2OvREDq1PJ5QMjWQ',
                },
              }
            : undefined
        instance = new TileLayer({
          ...layerOptions,
          earth,
        }).getLayers()
        break
    }
    return instance
  })
}
export {newLayersInstance, getRealData, chromaScale}
