/**
 * @author 白浅
 * @description GIS 多边形填充层适配器
 */

import {GeoJsonLayer} from "wave-map"
import makeFunction from "@utils/make-function"
import {getTransformNumber} from "@utils/gis-util"
import {valueIsFunction} from "@utils/field-processor"
import BaseAdapter from "../base-adapter"

class Adapter extends BaseAdapter {
  name = "od-line"

  getOptions() {
    const options = {
      data: this.cacheData || [],
      colorRange: this.themeRGBColors
    }

    Object.entries(this.style).forEach(([k, v]) => {
      options[k] = v
    })
    const advancedOption = ["filledColor", "extrudedHeight"]
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
      data,
      filled,
      filledColor,
      stroked,
      strokedLineColor,
      strokedLineWidth,
      extruded,
      extrudedHeight,
      showLabel,
      labelSize,
      labelColor,
      getTextAnchor,
      getAlignmentBaseline,
      onClick,
      onHover
    } = options

    const {zoom, latitude} = this.earth?.currentViewState

    this.geoJsonLayer = new GeoJsonLayer({
      earth: this.earth,
      data,
      filled,
      getFillColor: filledColor,
      stroked,
      wireframe: stroked,
      getLineColor: strokedLineColor,
      getLineWidth: strokedLineWidth || 1,
      extruded,
      getElevation: (d) =>
        getTransformNumber(extrudedHeight(d), zoom, latitude),
      // labelData,
      getLabel: (d) => d.label,
      getLabelPosition: (d) => d.center,
      showLabel,
      labelSize,
      labelColor,
      getTextAnchor,
      getAlignmentBaseline,
      onClick,
      onHover
    })
    return this.geoJsonLayer
  }

  update(newStyle) {
    this.style = {...this.style, ...newStyle}
    this.deckReDraw()
  }

  destroy() {}
}

export default Adapter
