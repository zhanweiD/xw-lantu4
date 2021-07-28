import {
  getLayersConfig,
  textLayer,
  rectLayer,
  axisLayer,
  auxiliaryLayer
} from "@waves4/configs"
import data from "./data"

export const config = (k) => ({
  key: "waterfallColumn",
  name: k("waterfallColumn"),
  // 图表容器初始化的大小
  layout: () => [400, 250],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: "cartesian-bandX-linearY",
  // 追加图层
  getLayersConfig: () => getLayersConfig("cartesian-bandX-linearY"),
  // 图层声明和定义，id无法定义由工具自动生成
  layers: [
    {
      key: "text",
      type: "text",
      name: "标题层",
      children: textLayer.children(),
      other: textLayer.other({
        content: "某月消费情况分析"
      })
    },
    {
      key: "rect",
      type: "rect",
      name: "矩形层",
      axis: "main", // minor
      children: rectLayer.children(),
      other: rectLayer.other({
        type: "column",
        mode: "waterfall"
      }),
      dataConfig: [
        [
          {
            name: "矩形层-数值",
            type: ["string", "number"],
            range: [1, Infinity],
            value: [
              {
                key: "支出",
                name: "支出",
                type: "number"
              }
            ]
          }
        ]
      ]
    },
    {
      key: "auxiliary",
      type: "auxiliary",
      name: "辅助线层",
      children: auxiliaryLayer.children({
        line: {
          strokeSolidColor: "rgb(255,255,0)"
        }
      }),
      other: auxiliaryLayer.other({
        type: "horizontal",
        labelPosition: "right",
        value: 5000
      })
    },
    {
      key: "axis",
      type: "axis",
      name: "坐标轴层",
      children: axisLayer.children(null, "cartesian-bandX-linearY"),
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
            key: "消费类型",
            name: "消费类型",
            type: "string"
          }
        ]
      }
    ]
  },
  // 交互
  interaction: {}
})
