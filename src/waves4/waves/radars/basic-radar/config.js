import {getLayersConfig, textLayer, legendLayer, axisLayer, radarLayer} from "@waves4/configs"
import data from "./data"

export const config = (k) => ({
  key: "basicRadar",
  name: k("basicRadar"),
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
      other: textLayer.other({
        content: "2020年中国前五智能手机厂商市场份额占比"
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
      key: "radar",
      type: "radar",
      name: "雷达层",
      children: radarLayer.children(),
      other: radarLayer.other({
        mode: "default"
      }),
      dataConfig: [
        [
          {
            name: "雷达层-数值",
            type: ["string", "number"],
            range: [1, Infinity],
            value: [
              {
                key: "市场份额",
                name: "市场份额",
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
      other: axisLayer.other({
        type: "polar"
      })
    }
  ],
  // 数据
  data: {
    type: "json",
    json: data,
    dimension: [
      {
        name: "雷达层-维度",
        type: ["string"],
        range: [1, 1],
        value: [
          {
            key: "供应商",
            name: "供应商",
            type: "string"
          }
        ]
      }
    ]
  },
  // 交互
  interaction: {}
})
