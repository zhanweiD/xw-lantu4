/**
 * @author 南风
 * @description GeoJSON预览
 */
import React, {useEffect, useRef} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import GeojsonPreviewSvg from "./geojson-preview-svg"

// 后续考虑开放geojson样式配置
const GeojsonPreview = ({geojson, height, className}) => {
  const ref = useRef(null)
  useEffect(() => {
    let instance = {}
    const option = {}
    if (ref.current) {
      option.container = ref.current
      instance = new GeojsonPreviewSvg(option)
      instance.data(geojson)
      instance.draw({
        redraw: true
      })
    }
    return () => {
      instance = null
    }
  }, [geojson])

  return <div ref={ref} className={c("wh100p", className)} style={{height}} />
}

export default observer(GeojsonPreview)
