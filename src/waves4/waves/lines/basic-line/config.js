import {getLayersConfig, textLayer, lineLayer, legendLayer, axisLayer} from "@waves4/configs"
import data from "./data"

export const config = (k) => ({
  key: "basicLine",
  name: k("basicLine"),
  // 图表容器初始化的大小
  layout: () => [500, 300],
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
        content: "2018年CPI走势"
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
      key: "line",
      type: "line",
      name: "折线层",
      axis: "main", // minor
      children: lineLayer.children(),
      other: lineLayer.other(),
      dataConfig: [
        [
          {
            name: "折线层-数值",
            type: ["string", "number"],
            range: [1, Infinity],
            value: [
              {
                key: "CPI",
                name: "CPI",
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
        name: "折线层-维度",
        type: ["string"],
        range: [1, 1],
        value: [
          {
            key: "日期",
            name: "日期",
            type: "string"
          }
        ]
      }
    ]
  },
  // 交互
  interaction: {}
})
