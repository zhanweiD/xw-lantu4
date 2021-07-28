import {
  getLayersConfig,
  textLayer,
  rectLayer,
  legendLayer,
  axisLayer
} from "@waves4/configs"
import data from "./data"

export const config = (k) => ({
  key: "bulletBar",
  name: k("bulletBar"),
  // 图表容器初始化的大小
  layout: () => [400, 250],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: "cartesian-linearX-bandY",
  // 追加图层
  getLayersConfig: () => getLayersConfig("cartesian-linearX-bandY"),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: "text",
      type: "text",
      name: "标题层",
      children: textLayer.children(),
      other: textLayer.other({
        content: "某连锁店在不同地区的门店数量分析"
      })
    },
    {
      key: "legend",
      type: "legend",
      name: "图例层",
      children: legendLayer.children(),
      other: legendLayer.other()
    },
    {
      key: "rect1",
      type: "rect",
      name: "矩形层1",
      axis: "main", // minor
      children: rectLayer.children({
        rect: {
          fillType: "solid",
          fillSolidColor: "rgb(255, 255, 0)"
        }
      }),
      other: rectLayer.other({
        type: "bar",
        mode: "group",
        paddingInner: 0.9,
        labelPositionMax: "right-outer"
      }),
      dataConfig: [
        [
          {
            name: "矩形层1-数值",
            type: ["string", "number"],
            range: [1, Infinity],
            value: [
              {
                key: "目标",
                name: "目标",
                type: "number"
              }
            ]
          }
        ]
      ]
    },
    {
      key: "rect2",
      type: "rect",
      name: "矩形层2",
      axis: "main", // minor
      children: rectLayer.children(),
      other: rectLayer.other({
        type: "bar",
        mode: "group",
        labelPositionMax: "right-outer"
      }),
      dataConfig: [
        [
          {
            name: "矩形层2-数值",
            type: ["string", "number"],
            range: [1, Infinity],
            value: [
              {
                key: "当前",
                name: "当前",
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
      children: axisLayer.children(null, "cartesian-linearX-bandY"),
      other: axisLayer.other()
    }
  ],
  // 数据
  data: {
    type: "json",
    json: data,
    dimension: [
      {
        name: "矩形层-维度",
        type: ["string"],
        range: [1, 1],
        value: [
          {
            key: "地区",
            name: "地区",
            type: "string"
          }
        ]
      }
    ]
  },
  // 交互
  interaction: {}
})
