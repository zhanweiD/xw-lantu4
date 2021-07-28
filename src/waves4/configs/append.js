import lineLayer from "./line"
import rectLayer from "./rect"
import arcLayer from "./arc"
import radarLayer from "./radar"
import scatterLayer from "./scatter"

// 图层坐标系类型映射
const layers = [
  {
    // 图层 key 用于区分唯一的配置结构
    key: "append-rect",
    // 图层类型
    type: "rect",
    // 图层默认名字
    name: "矩形层-柱状",
    // 图层所属坐标系
    coordinate: "cartesian-bandX-linearY",
    // 图层子层配置
    children: rectLayer.children(),
    // 图层其他配置
    other: rectLayer.other({
      type: "column"
    }),
    data: {
      // 数据字段的名称
      name: "矩形层-数值",
      // 图层需要的数据类型
      type: ["number"],
      // 数据映射
      range: [1, Infinity]
    }
  },
  {
    key: "append-rect",
    type: "rect",
    name: "矩形层-条形",
    coordinate: "cartesian-linearX-bandY",
    children: rectLayer.children,
    other: rectLayer.other({
      type: "bar"
    }),
    data: {
      name: "矩形层-数值",
      type: ["number"],
      range: [1, Infinity]
    }
  },
  {
    key: "append-line",
    type: "line",
    name: "折线层",
    coordinate: "cartesian-bandX-linearY",
    children: lineLayer.children,
    other: lineLayer.other(),
    data: {
      name: "折线层-数值",
      type: ["number"],
      range: [1, Infinity]
    }
  },
  {
    key: "append-arc",
    type: "arc",
    name: "圆弧层-饼",
    coordinate: "polar-bandAngle-linearRadius",
    children: arcLayer.children,
    other: arcLayer.other({
      type: "pie"
    }),
    data: {
      name: "圆弧层-数值",
      type: ["number"],
      range: [1, Infinity]
    }
  },
  {
    key: "append-arc",
    type: "arc",
    name: "圆弧层-蓝丁格尔玫瑰",
    coordinate: "polar-bandAngle-linearRadius",
    children: arcLayer.children,
    other: arcLayer.other({
      type: "nightingaleRose"
    }),
    data: {
      name: "圆弧层-数值",
      type: ["number"],
      range: [1, Infinity]
    }
  },
  {
    key: "append-radar",
    type: "radar",
    name: "雷达层",
    coordinate: "polar-bandAngle-linearRadius",
    children: radarLayer.children,
    other: radarLayer.other(),
    data: {
      name: "雷达层-数值",
      type: ["number"],
      range: [1, Infinity]
    }
  },
  {
    key: "append-scatter",
    type: "scatter",
    name: "散点层",
    coordinate: "cartesian-linearX-linearY",
    children: scatterLayer.children,
    other: scatterLayer.other(),
    data: {
      name: "散点层-数值",
      type: ["number"],
      range: [2, Infinity]
    }
  }
]

// 判断图表能够追加的图层-基于坐标系
const getLayersConfig = (coordinate) => {
  return layers.filter((layer) => layer.coordinate === coordinate)
}

export default getLayersConfig
