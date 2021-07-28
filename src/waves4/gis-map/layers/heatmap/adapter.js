/**
 * @author 白浅
 * @description GIS 热力图层适配器
 */

import {HeatmapLayer} from "wave-map"
import makeFunction from "@utils/make-function"
import {getTransformNumber} from "@utils/gis-util"
import {valueIsFunction} from "@utils/field-processor"
import BaseAdapter from "../base-adapter"

class Adapter extends BaseAdapter {
  name = "heatmap"

  init() {
    // console.log('init', this.name)
  }

  data() {
    // console.log('data', this.name)
  }

  getOptions() {
    const options = {
      data: this.cacheData || [],
      colorRange: this.themeRGBColors
    }

    Object.entries(this.style).forEach(([k, v]) => {
      options[k] = v
    })
    const advancedOption = [
      "iconWidth",
      "iconHeight",
      "iconAnchorX",
      "iconAnchorY"
    ]
    advancedOption.forEach((option) => {
      if (valueIsFunction(this.style[option])) {
        const getAdvancedOption = makeFunction(this.style[option])
        options[option] = (d) => {
          return getAdvancedOption(d)
        }
      }
    })

    return options
  }

  reData({pass, message, data}) {
    if (pass) {
      this.cacheData = []
      this.cacheData = data.map((d) => {
        return {
          ...d,
          centroid: [d._translateData.lng, d._translateData.lat],
          avatar_url: d._translateData.icon
        }
      })
      this.deckReDraw()
    } else {
      this.warn(message)
    }
  }

  getLayerInstance = () => {
    const options = this.getOptions()
    const {
      radius,
      colorRange,
      heatmapType,
      extruded,
      elevationRange,
      // 暂时不需要对外暴露
      // intensity, // 该值乘以一个像素的总权重以获得最终权重，大于1颜色偏向光谱的高端，小于1会偏向光谱的低端
      // threshold, // 衰弱权重与最大权重的比率，阈值 0-1
      // aggregation, // 用于汇总所有数据点权重以计算像素的颜色值的运算，SUM指总和，MEAN指平均值
      onClick,
      onHover
    } = options

    const {zoom, latitude} = this.earth?.currentViewState

    this.heatmapLayer = new HeatmapLayer({
      earth: this.earth,
      // data: this.data,
      // TODO 需要更新wave-map
      data: this.data.map((item) => {
        return {...item, centroid: [item.longitude, item.latitude]}
      }),
      getPosition: (d) => {
        return [d.longitude, d.latitude]
      },
      // 半径转化，未默认热力图用的单位是米，需要根据当前zoom来释放放大
      radius:
        heatmapType === "classic"
          ? radius
          : getTransformNumber(radius, zoom, latitude),
      colorRange,
      heatmapType,
      extruded: extruded === "3d",
      elevationRange: getTransformNumber(elevationRange, zoom, latitude) || [
        0, 999999
      ],
      onClick,
      onHover
    })
    return this.heatmapLayer
  }

  update(newStyle) {
    this.style = {...this.style, ...newStyle}
    this.deckReDraw()
  }

  destroy() {}
}

export default Adapter
