import {
  getLayersConfig,
  textLayer,
  arcLayer,
  axisLayer,
  legendLayer
} from "@waves4/configs"
import data from "./data"

export const config = (k) => ({
  key: "donutNightingaleRose",
  name: k("donutNightingaleRose"),
  // 图表容器初始化的大小
  layout: () => [400, 300],
  // 图表主绘图区域的内边距
  padding: [60, 0, 30, 0],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: "polar-bandAngle-linearRadius",
  // 追加图层
  getLayersConfig: () => getLayersConfig("polar-bandAngle-linearRadius"),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: "text",
      type: "text",
      name: "标题层",
      children: textLayer.children(),
      other: textLayer.other()
    },
    {
      key: "legend",
      type: "legend",
      name: "图例层",
      children: legendLayer.children(),
      other: legendLayer.other()
    },
    {
      key: "arc",
      type: "arc",
      name: "圆弧层",
      children: arcLayer.children(),
      other: arcLayer.other({
        type: "nightingaleRose",
        innerRadius: 30
      }),
      dataConfig: [
        [
          {
            name: "圆弧层-数值",
            type: ["string", "number"],
            range: [1, Infinity],
            value: [
              {
                key: "数量",
                name: "数量",
                type: "number"
              }
            ]
          }
        ]
      ]
    },
    {
      key: "axis",
      type: "axis",
      name: "坐标轴层",
      children: axisLayer.children(null, "polar-bandAngle-linearRadius"),
      other: axisLayer.other()
    }
  ],
  // 数据
  data: {
    type: "json",
    json: data,
    dimension: [
      {
        name: "圆弧层-维度",
        type: ["string"],
        range: [1, 1],
        value: [
          {
            key: "省份",
            name: "省份",
            type: "string"
          }
        ]
      }
    ]
  },
  // 交互
  interaction: {}
})
