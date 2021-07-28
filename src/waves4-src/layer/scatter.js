import LayerBase from "./base"
import Scale from "../data/scale"

// 默认样式
const defaultStyle = {
  circleSize: [5, 5],
  circle: {},
  text: {}
}

// 散点气泡层
export default class ScatterLayer extends LayerBase {
  #data = null

  #scale = {}

  #style = defaultStyle

  #circleData = []

  #textData = []

  get data() {
    return this.#data
  }

  get scale() {
    return this.#scale
  }

  get style() {
    return this.#style
  }

  // 初始化默认值
  constructor(layerOptions, waveOptions) {
    super(layerOptions, waveOptions, ["circle", "text"])
    this.className = "wave-scatter"
  }

  // 列数据依次为：分组名称、x轴坐标值、y轴坐标值、数值（可缺省）
  setData(data, scales = {}) {
    this.#data = data || this.#data
    const {left, top, width, height} = this.options.layout
    const pureTableList = this.#data.transpose(
      this.#data.data.map(({list}) => list)
    )
    const headers = this.#data.data.map(({header}) => header)
    // 初始化比例尺
    this.#scale.nice = {paddingInner: 0, ...this.#scale.nice, ...scales.nice}
    this.#scale = this.createScale(
      {
        scaleX:
          scales.scaleX ||
          new Scale({
            type: "linear",
            domain: this.#data.select(headers.slice(1, 2)).range(),
            range: [0, width],
            nice: this.#scale.nice
          }),
        scaleY:
          scales.scaleY ||
          new Scale({
            type: "linear",
            domain: this.#data.select(headers.slice(2, 3)).range(),
            range: [height, 0],
            nice: this.#scale.nice
          })
      },
      this.#scale,
      scales
    )
    // 计算点的基础数据
    const circleData = pureTableList.map(([category, x, y, value]) => ({
      cx: left + this.#scale.scaleX(x),
      cy: top + this.#scale.scaleY(y),
      dimension: [x, y],
      category,
      value
    }))
    // 数据根据第一列的名称分组
    const categorys = Array.from(
      new Set(circleData.map(({category}) => category))
    )
    this.#circleData = new Array(categorys.length).fill(null).map(() => [])
    circleData.forEach((uncategorizedData) => {
      const index = categorys.findIndex(
        (category) => category === uncategorizedData.category
      )
      this.#circleData[index].push(uncategorizedData)
    })
  }

  // 覆盖默认图层样式
  setStyle(style) {
    this.#style = this.createStyle(defaultStyle, this.#style, style)
    const {circleSize, text} = this.#style
    const scaleSize = new Scale({
      type: "linear",
      domain:
        this.#data.data.length >= 4
          ? this.#data.select(this.#data.data[3].header).range()
          : [],
      range: circleSize.map((value) => value / 2),
      nice: null
    })
    // 颜色跟随主题
    const colors = this.getColor(
      this.#circleData.length,
      this.#style.circle?.fill,
      true
    )
    this.#circleData.forEach((groupData, i) =>
      groupData.forEach((item) => (item.color = colors[i]))
    )
    // 圆点大小数据
    this.#circleData = this.#circleData.map((groupData) => {
      return groupData.map(({value, ...others}) => ({
        value,
        ...others,
        rx: value !== undefined ? scaleSize(value) : circleSize[0] / 2,
        ry: value !== undefined ? scaleSize(value) : circleSize[0] / 2
      }))
    })
    // 标签文字数据
    this.#textData = this.#circleData.map((groupData) =>
      groupData.map(({cx, cy, value}) => {
        return this.createText({
          x: cx,
          y: cy,
          value: value || "",
          style: text,
          position: "center"
        })
      })
    )
  }

  // 绘制
  draw() {
    const circleData = this.#circleData.map((groupData) => {
      const data = groupData.map(({rx, ry}) => [rx, ry])
      const position = groupData.map(({cx, cy}) => [cx, cy])
      const source = groupData.map(({category, value, dimension}) => ({
        category,
        value,
        dimension
      }))
      const fill = groupData.map(({color}) => color)
      return {data, source, position, ...this.#style.circle, fill}
    })
    const textData = this.#textData.map((groupData) => {
      const position = groupData.map(({x, y}) => [x, y])
      const data = groupData.map(({value}) => value)
      return {data, position, ...this.#style.text}
    })
    this.drawBasic("circle", circleData)
    this.drawBasic("text", textData)
  }
}
