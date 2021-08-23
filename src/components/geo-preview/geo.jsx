import React from "react"

import GeojsonPreview from "./geojson-preview"

const Geo = ({path}) => {
  let geoResult
  try {
    const geoPath = path
    const xhr = new XMLHttpRequest()
    xhr.open("get", geoPath, false)
    xhr.send()
    const responseFile = xhr.response
    geoResult = JSON.parse(responseFile)
  } catch (error) {
    console.log("读取GeoJSON失败", error)
  }
  return geoResult ? <GeojsonPreview geojson={geoResult} /> : "读取GeoJSON失败"
}

export default Geo
