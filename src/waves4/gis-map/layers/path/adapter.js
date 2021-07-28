/**
 * @author 白浅
 * @description GIS 轨迹图层适配器
 */

import {PathLayer} from "wave-map"
import makeFunction from "@utils/make-function"
import {valueIsFunction} from "@utils/field-processor"
import BaseAdapter from "../base-adapter"

class Adapter extends BaseAdapter {
  name = "path"

  getOptions() {
    const options = {
      data: this.cacheData || []
    }

    Object.entries(this.style).forEach(([k, v]) => {
      options[k] = v
    })

    const advancedOption = []
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
      data.forEach((item) => {
        this.cacheData.push({
          path: item._translateData.pathArray,
          color: [255, 255, 255]
        })
      })
      this.deckReDraw()
    } else {
      this.warn(message)
    }
  }

  getLayerInstance = () => {
    const options = this.getOptions()
    const {
      showPath,
      pathWidth,
      pathColor,
      rounded,
      showTrail,
      trailWidth,
      trailLength,
      trailColor,
      trailSpeed,
      showEndVertex,
      endVertexColor,
      endVertexSize,
      showVertex,
      vertexColor,
      vertexSize
    } = options

    this.pathLayer = new PathLayer({
      earth: this.earth,
      data: this.parseToPathData(this.data),
      showPath,
      pathWidth,
      pathColor,
      rounded,
      showTrail,
      trailWidth,
      trailLength,
      trailColor,
      trailSpeed,
      showEndVertex,
      endVertexColor,
      endVertexSize,
      showVertex,
      vertexColor,
      vertexSize
    })
    return this.pathLayer
  }

  parseToPathData(data) {
    const pathMap = {}
    data.forEach((item) => {
      const {pathId} = item
      if (pathMap[pathId]) {
        pathMap[pathId].path.push([item.longitude, item.latitude])
        pathMap[pathId].timestamps.push(item.time)
      } else {
        pathMap[pathId] = {
          path: [[item.longitude, item.latitude]],
          timestamps: [item.time]
        }
      }
    })
    return Object.values(pathMap)
  }

  update(newStyle) {
    this.style = {...this.style, ...newStyle}
    // 改变样式之后reDraw一下
    this.deckReDraw()
  }

  destroy() {}
}

export default Adapter
