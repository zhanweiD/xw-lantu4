import {baseMapConfig} from "./layers/basemap/config"
import {geoJsonLayerConfig} from "./layers/geojson/config"
import {scatterLayerConfig} from "./layers/scatter/config"
import {iconLayerConfig} from "./layers/icon/config"
import {heatmapLayerConfig} from "./layers/heatmap/config"
import {odLineLayerConfig} from "./layers/od-line/config"
import {pathLayerConfig} from "./layers/path/config"
import {bimLayerConfig} from "./layers/bim/config"

// 根据这个配置生成组件的模型
export const config = (t) => ({
  // 这个key只是橱窗组件的key，不是图标库组件的key
  // 因为橱窗组件和图表库组件是N对N的关系
  key: "gisMap",
  name: t("gismap"),
  layout: () => [300, 300],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: "geo",

  getLayersConfig: () => {
    const map = [
      geoJsonLayerConfig(t),
      scatterLayerConfig(t),
      iconLayerConfig(t),
      heatmapLayerConfig(t),
      odLineLayerConfig(t),
      pathLayerConfig(t),
      bimLayerConfig(t)
    ]
    return map
  },
  layers: [
    // 默认添加所有的层
    // geoJsonLayerConfig(t), ok 业务数据结合有问题
    // scatterLayerConfig(t), ok
    // iconLayerConfig(t), ok
    // heatmapLayerConfig(t), ok
    // odLineLayerConfig(t), ok
    pathLayerConfig(t),
    {
      type: "basemap",
      key: "basemap",
      name: "底图层",
      // 其他针对图层的全局性配置
      other: baseMapConfig(t)
    }
  ],
  data: {
    type: "json",
    json: []
  }
})
