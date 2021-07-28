/**
 * @author 白浅
 * @description GIS 飞线层适配器
 */

import {OdLineLayer} from "wave-map"
import makeFunction from "@utils/make-function"
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
    const advancedOption = [
      "lineWidth",
      "flyPointWidth",
      "flyPointColor",
      "flyPointLength",
      "sourcePointSize",
      "targetPointSize"
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
      greatCircle,
      lineWidth,
      lineColor,
      lineHeight,
      // 飞线点配置
      showFlyPoint,
      flyPointColor,
      flyPointLength,
      flyPointWidth,
      // 节点配置
      sourcePoint,
      sourcePointColor,
      sourcePointSize,
      targetPoint,
      targetPointColor,
      targetPointSize,
      // 标签配置
      showLabel,
      labelSize,
      labelColor,
      getTextAnchor,
      getAlignmentBaseline,
      onClick,
      onHover
    } = options

    this.odLineLayer = new OdLineLayer({
      earth: this.earth,
      data: this.data,
      getWidth: lineWidth,
      greatCircle,
      getHeight: lineHeight,
      getSourcePosition: (d) => [d.sourceLongitude, d.sourceLatitude],
      getTargetPosition: (d) => [d.targetLongitude, d.targetLatitude],
      getSourceColor: lineColor[0],
      getTargetColor: lineColor[2],
      flyPoint: showFlyPoint,
      flyPointColor,
      flyPointSize: flyPointLength,
      flyPointWidth,
      sourcePoint,
      sourcePointColor,
      sourcePointSize,
      targetPoint,
      targetPointColor,
      targetPointSize,
      sourceLabel: showLabel,
      targetLabel: showLabel,
      targetLabelSize: labelSize,
      sourceLabelSize: labelSize,
      sourceLabelColor: labelColor,
      targetLabelColor: labelColor,
      getAngle: 0,
      getTextAnchor,
      getAlignmentBaseline,
      onClick,
      onHover
    })
    return this.odLineLayer
  }

  update(newStyle) {
    this.style = {...this.style, ...newStyle}
    this.deckReDraw()
  }

  destroy() {}
}

export default Adapter
