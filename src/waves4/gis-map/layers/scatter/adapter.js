/**
 * @author 白浅
 * @description GIS 散点气泡层适配器
 */

import {PointLayer as ScatterLayer} from "wave-map"
import makeFunction from "@utils/make-function"
import {valueIsFunction} from "@utils/field-processor"
import {getTransformNumber} from "@utils/gis-util"
import BaseAdapter from "../base-adapter"

class Adapter extends BaseAdapter {
  name = "scatter"

  getOptions() {
    const options = {
      data: this.cacheData || [],
      colorRange: this.themeRGBColors
    }

    Object.entries(this.style).forEach(([k, v]) => {
      options[k] = v
    })
    const advancedOption = ["scatterColor", "scatterSize", "scatterHeight"]
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
      scatterColor,
      scatterSize,
      scatterHeight,
      // scatterUnits,
      // 文本配置
      showLabel,
      labelSize,
      labelColor,
      onClick,
      onHover
    } = options

    const {zoom, latitude} = this.earth?.currentViewState
    this.scatterLayer = new ScatterLayer({
      earth: this.earth,
      data: this.data,
      getPosition: (d) => {
        return [d.longitude, d.latitude]
      },
      type: scatterHeight() === 0 ? "2D" : "3D",
      extruded: true,
      // 3D的时候多边形边数，取10逼近圆的效果
      diskResolution: 20,
      getFillColor: scatterColor,
      getLineColor: scatterColor,
      getRadius: (d) => {
        return scatterHeight(d) === 0
          ? scatterSize(d)
          : getTransformNumber(scatterSize(d), zoom, latitude)
      },
      getElevationValue: (d) =>
        getTransformNumber(scatterHeight(d), zoom, latitude) / 2,
      // 默认用像素，暂时只开放像素
      // radiusUnits: scatterUnits,
      // lineWidthUnits: scatterUnits,
      label: showLabel,
      labelSize:
        scatterHeight() === 0
          ? labelSize
          : getTransformNumber(labelSize, zoom, latitude),
      labelColor,
      getText: (d) => String(d.value),
      onClick,
      onHover
    })
    return this.scatterLayer
  }

  update(newStyle) {
    this.style = {...this.style, ...newStyle}
    this.deckReDraw()
  }

  destroy() {}
}

export default Adapter
