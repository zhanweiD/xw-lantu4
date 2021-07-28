import {getLayersConfig, textLayer, chordLayer} from "@waves4/configs"
import data from "./data"

export const config = (k) => ({
  key: "chord",
  name: k("chord"),
  // 图表容器初始化的大小
  layout: () => [600, 600],
  // 图表主绘图区域的内边距
  padding: [60, 40, 40, 40],
  // 图表绑定坐标轴类型，新追加的层必须是相同的坐标类型
  coordinate: "polar",
  // 追加图层
  getLayersConfig: () => getLayersConfig("polar"),
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
      key: "chord",
      type: "chord",
      name: "和弦图层",
      children: chordLayer.children(),
      other: chordLayer.other(),
      dataConfig: [
        [
          {
            name: "矩阵层-数值",
            type: ["number"],
            range: [1, Infinity],
            value: [
              {
                key: "数值",
                name: "数值",
                type: "number"
              }
            ]
          }
        ]
      ]
    }
  ],
  // 数据
  data: {
    type: "json",
    json: data,
    dimension: [
      {
        name: "矩阵层-维度",
        type: ["string"],
        range: [2, 2],
        value: [
          {
            key: "年份",
            name: "年份",
            type: "string"
          },
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
