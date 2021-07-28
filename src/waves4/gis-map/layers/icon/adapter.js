/**
 * @author 白浅
 * @description GIS 图标图层适配器
 */
import hJSON from "hanson"
import {IconLayer} from "wave-map"
import makeFunction from "@utils/make-function"
import {valueIsFunction} from "@utils/field-processor"
import BaseAdapter from "../base-adapter"

class Adapter extends BaseAdapter {
  name = "icon"

  getOptions() {
    const options = {
      // data: this.cacheData || [],
      colorRange: this.themeRGBColors
    }

    Object.entries(this.style).forEach(([k, v]) => {
      options[k] = v
    })
    const advancedOption = [
      "iconWidth",
      "iconHeight",
      "iconAnchorX",
      "iconAnchorY",
      "iconSize"
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

  /**
   * @白浅
   * TODO
   * 根据新数据和新映射关系，更新图层
   * 下面这坨要改，参考 getLayerInstance 中对数据的处理
   *
   * */
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
      iconWidth,
      iconHeight,
      iconAnchorX,
      iconAnchorY,
      iconSize,
      showLabel,
      labelSize,
      labelColor,
      getTextAnchor,
      getAlignmentBaseline,
      onClick,
      onHover
    } = options

    this.iconLayer = new IconLayer({
      earth: this.earth,
      data: this.data,
      iconWidth,
      iconHeight,
      iconSize,
      iconAnchorX:
        iconAnchorX === "start"
          ? 0
          : iconAnchorX === "middle"
          ? iconWidth / 2
          : iconWidth,
      iconAnchorY:
        iconAnchorY === "top"
          ? 0
          : iconAnchorY === "center"
          ? iconHeight / 2
          : iconHeight,
      getPosition: (item) => {
        return [item.longitude, item.latitude]
      },
      showLabel,
      labelSize,
      labelColor,
      getLabel: (item) => {
        return item.name
      },
      getLabelPosition: (item) => {
        return [item.longitude, item.latitude]
      },
      getAngle: 0,
      getTextAnchor,
      getAlignmentBaseline,
      onClick,
      onHover
    })

    return this.iconLayer
  }

  update(newStyle) {
    this.style = {...this.style, ...newStyle}
    this.deckReDraw()
  }

  destroy() {
    this.iconLayer = null
  }
}

export default Adapter
