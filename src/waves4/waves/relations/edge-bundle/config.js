import {getLayersConfig, textLayer, edgeBundleLayer} from "@waves4/configs"
import data from "./data"

export const config = (k) => ({
  key: "edgeBundle",
  name: k("edgeBundle"),
  // 图表容器初始化的大小
  layout: () => [600, 600],
  // 图表主绘图区域的内边距
  padding: [60, 60, 60, 60],
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
      other: textLayer.other({
        content: "部分大学录取情况"
      })
    },
    {
      key: "edgeBundle",
      type: "edgeBundle",
      name: "边缘捆图层",
      children: edgeBundleLayer.children(),
      other: edgeBundleLayer.other(),
      dataConfig: [
        [
          {
            name: "节点名称",
            type: ["string", "number"],
            range: [1, 1],
            value: [
              {
                key: "name",
                name: "节点名称",
                type: "string"
              }
            ]
          },
          {
            name: "节点类型",
            type: ["string"],
            range: [1, 1],
            value: [
              {
                key: "category",
                name: "节点类型",
                type: "string"
              }
            ]
          },
          {
            name: "节点值",
            type: ["number"],
            range: [1, 1],
            value: [
              {
                key: "value",
                name: "节点值",
                type: "number"
              }
            ]
          }
        ],
        [
          {
            name: "边开始",
            type: ["string", "number"],
            range: [1, 1],
            value: [
              {
                key: "from",
                name: "边开始",
                type: "string"
              }
            ]
          },
          {
            name: "边结束",
            type: ["string", "number"],
            range: [1, 1],
            value: [
              {
                key: "to",
                name: "边结束",
                type: "string"
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
    json: data
  },
  // 交互
  interaction: {}
})
