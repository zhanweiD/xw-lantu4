import * as d3 from "d3"

export default class GeojsonPreviewSvg {
  constructor(option) {
    // 和组件层解耦
    // super(option, defaultOption)

    if (!option.container) {
      return
    }

    this.container = d3.select(option.container)

    // 重复实例化到同一个元素，保证没有残留
    this.container.html("")

    // 取出容器的宽高
    this.containerWidth = +this.container.style("width").match(/^\d*/)[0]
    this.containerHeight = +this.container.style("height").match(/^\d*/)[0]

    // 创建svg节点
    const svg = this.container.append("svg")
    svg.attr("width", this.containerWidth).attr("height", this.containerHeight)

    this.mainWidth = this.containerWidth
    this.mainHeight = this.containerHeight
    this.root = svg.append("g").attr("width", this.containerWidth).attr("height", this.containerHeight)

    this._data = {}
    // d3
    this._projection = d3.geoMercator()
  }

  data(geojson) {
    this._data.geojson = geojson
  }

  draw({redraw}) {
    if (redraw === true) {
      this.root.html("")
    }
    if (this._data.geojson && this._data.geojson.features) {
      this._makeMap(this._data.geojson)
    } else {
      this.root
        .append("text")
        .attr("x", this.mainWidth / 3)
        .attr("y", this.mainHeight / 2)
        .attr("fill", "white")
        .text("GeoJSON格式错误")
    }
  }

  // 绘制地图
  _makeMap(geo) {
    const getPath = d3.geoPath().projection(this._projection)
    // 自适应画板 让地图居中
    this._projection.fitExtent(
      [
        [0, 0],
        [this.mainWidth, this.mainHeight]
      ],
      geo
    )

    // 地图容器
    this._mapContainer = this.root.append("g").classed("map-regions", true)
    // 绘制各个省份区域
    this._mapContainer
      .selectAll("path")
      .data(geo.features)
      .enter()
      .append("path")
      .attr("d", getPath)
      .attr("stroke-width", 1)
      .attr("stroke", "#dddddd")
      .attr("fill", () => {
        return "rgba(255,255,255,0.03)"
      })
  }

  destroy() {
    this.loopCircle = false
  }
}
