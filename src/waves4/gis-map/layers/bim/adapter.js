/**
 * @author 白浅
 * @description GIS 三维实景层适配器
 */

import {TileLayer} from "wave-map"
import makeFunction from "@utils/make-function"
import {valueIsFunction} from "@utils/field-processor"
import BaseAdapter from "../base-adapter"

class Adapter extends BaseAdapter {
  name = "bim"

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
      // TODO 暂时注释，等待对接真实数据
      // data,
      tileUrl,
      tileType,
      onClick,
      onHover
    } = options

    this.layer = new TileLayer({
      earth: this.earth,
      tileUrl,
      tileType,
      onClick,
      onHover
    })
    return this.layer
  }

  update(newStyle) {
    this.style = {...this.style, ...newStyle}
    this.deckReDraw()
  }

  destroy() {}
}

export default Adapter
