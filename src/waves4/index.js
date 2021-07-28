import i18n from "../i18n"
import basicLine from "./waves/lines/basic-line"
import groupLine from "./waves/lines/group-line"
import areaLine from "./waves/lines/area-line"
import stackAreaLine from "./waves/lines/stack-area-line"
import stepLine from "./waves/lines/step-line"
import basicColumn from "./waves/columns/basic-column"
import groupColumn from "./waves/columns/group-column"
import intervalColumn from "./waves/columns/interval-column"
import stackColumn from "./waves/columns/stack-column"
import waterfallColumn from "./waves/columns/waterfall-column"
import bulletColumn from "./waves/columns/bullet-column"
import basicLineColumn from "./waves/line-columns/basic-line-column"
import groupLineColumn from "./waves/line-columns/group-line-column"
import stackLineColumn from "./waves/line-columns/stack-line-column"
import basicBar from "./waves/bars/basic-bar"
import groupBar from "./waves/bars/group-bar"
import intervalBar from "./waves/bars/interval-bar"
import stackBar from "./waves/bars/stack-bar"
import waterfallBar from "./waves/bars/waterfall-bar"
import bulletBar from "./waves/bars/bullet-bar"
import basicPie from "./waves/pies/basic-pie"
import donut from "./waves/pies/donut"
import nightingaleRose from "./waves/pies/nightingale-rose"
import donutNightingaleRose from "./waves/pies/donut-nightingale-rose"
import stackNightingaleRose from "./waves/pies/stack-nightingale-rose"
import basicRadar from "./waves/radars/basic-radar"
import groupRadar from "./waves/radars/group-radar"
import stackRadar from "./waves/radars/stack-radar"
import scatter from "./waves/scatters/scatter"
import bubble from "./waves/scatters/bubble"
import text from "./waves/others/text"
import rectMatrix from "./waves/matrices/rect-matrix"
import circleMatrix from "./waves/matrices/circle-matrix"
import edgeBundle from "./waves/relations/edge-bundle"
import chord from "./waves/relations/chord"
import sankey from "./waves/relations/sankey"
import gisMap from "./gis-map"

const waves = {
  // 折线图
  basicLine, // 基础折线
  groupLine, // 分组折线
  areaLine, // 面积折线
  stackAreaLine, // 堆叠面积
  stepLine, // 阶梯折线

  // 柱状图
  basicColumn, // 基础柱状
  groupColumn, // 分组柱状
  intervalColumn, // 区间柱状
  stackColumn, // 堆叠柱状
  waterfallColumn, // 瀑布柱状
  bulletColumn, // 子弹柱状
  basicLineColumn, // 基础折柱
  groupLineColumn, // 分组折柱
  stackLineColumn, // 堆叠折柱

  // 条形图
  basicBar, // 基础条形
  groupBar, // 分组条形
  intervalBar, // 区间条形
  stackBar, // 堆叠条形
  waterfallBar, // 瀑布条形
  bulletBar, // 子弹条形

  // 饼图
  basicPie, // 基础饼图
  donut, // 环图
  nightingaleRose, // 夜莺玫瑰图
  donutNightingaleRose, // 环形夜莺玫瑰图
  stackNightingaleRose, // 堆叠夜莺玫瑰图

  // 雷达图
  basicRadar, // 基础雷达
  groupRadar, // 分组雷达
  stackRadar, // 堆叠雷达

  // 散点图
  scatter, // 散点
  bubble, // 气泡

  // 其他图表
  text, // 文本

  // 地图
  gisMap, // gis地图

  // 矩阵图
  rectMatrix, // 方形矩阵
  circleMatrix, // 圆形矩阵

  // 关系图
  edgeBundle, // 边缘捆图
  chord, // 和弦图
  sankey // 桑基图
}

Object.values(waves).forEach((wave) => {
  const k = i18n.sandbox(wave.i18n, wave.id || wave.icon)
  wave.config = wave.config(k)
  wave.Adapter = wave.Adapter(k)
})

export default waves

const categories = [
  {
    // 折线图
    name: "classifyLine",
    icon: "exhibit-line",
    exhibits: [
      basicLine, // 基础折线
      groupLine, // 分组折线
      areaLine, // 面积折线
      stackAreaLine, // 堆叠面积
      stepLine // 阶梯折线, // 基础折线
    ]
  },
  {
    // 柱状图
    name: "classifyColumn",
    icon: "exhibit-rect",
    exhibits: [
      basicColumn, // 基础柱状图
      groupColumn, // 分组柱状
      intervalColumn, // 区间柱状
      stackColumn, // 堆叠柱状
      waterfallColumn, // 瀑布柱状
      bulletColumn, // 子弹柱状
      basicLineColumn, // 基础折柱
      groupLineColumn, // 分组折柱
      stackLineColumn // 堆叠折柱
    ]
  },
  {
    // 条形图
    name: "classifyBar",
    icon: "exhibit-bar",
    exhibits: [
      basicBar, // 基础条形
      groupBar, // 分组条形
      intervalBar, // 区间条形
      stackBar, // 堆叠条形
      waterfallBar, // 瀑布条形
      bulletBar // 子弹条形
    ]
  },
  {
    // 饼图
    name: "classifyPie",
    icon: "exhibit-pie",
    exhibits: [
      basicPie, // 基础饼图
      donut, // 环图
      nightingaleRose, // 夜莺玫瑰图
      donutNightingaleRose, // 环形夜莺玫瑰图
      stackNightingaleRose // 堆叠夜莺玫瑰图
    ]
  },
  {
    // 雷达图
    name: "classifyRadar",
    icon: "exhibit-radar",
    exhibits: [
      basicRadar, // 基础雷达
      groupRadar, // 分组雷达
      stackRadar // 堆叠雷达
    ]
  },
  {
    // 散点图
    name: "classifyScatter",
    icon: "exhibit-point",
    exhibits: [
      scatter, // 散点
      bubble // 气泡
    ]
  },
  {
    // 散点图
    name: "classifyOthers",
    icon: "exhibit-other",
    exhibits: [
      text // 文本
    ]
  },
  {
    // 基础地图
    name: "classifyMap",
    icon: "exhibit-map",
    exhibits: [gisMap]
  },
  {
    // 矩阵
    name: "classifyHeatmap",
    icon: "exhibit-heatmap",
    exhibits: [
      rectMatrix, // 方形矩阵
      circleMatrix // 圆形矩阵
    ]
  },
  {
    // 关系图
    name: "classifyRelation",
    icon: "exhibit-relation",
    exhibits: [
      edgeBundle, // 边缘捆图
      chord, // 和弦图
      sankey // 桑基图
    ]
  }
]

categories.forEach((category) => {
  category.exhibits.forEach((exhibit, i) => {
    if (exhibit.completed) {
      const {config} = exhibit
      category.exhibits[i] = {
        ...exhibit,
        key: config.key,
        name: config.name
      }
    }
  })
})

export {categories}
