import {getLayersConfig, textLayer, rectLayer, legendLayer, axisLayer} from "@waves4/configs"
import data from "./data"

const pointLayer = (k) => ({
  name: "散点气泡层",
  type: "bubble",
  // 第二层sections
  sections: [
    {
      name: "label",
      // 如果有effective属性，且值为布尔，则该section可以整体切换是否生效
      effective: false
    }
  ]
})

export const config = (k) => ({
  key: "basicColumn",
  name: k("basicColumn"),
  // 图表容器初始化的大小
  layout: () => [500, 300],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  layers: [pointLayer(k)]
})
