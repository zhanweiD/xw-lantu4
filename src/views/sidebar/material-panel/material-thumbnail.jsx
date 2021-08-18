import React from "react"
import {observer} from "mobx-react-lite"
import GeojsonPreview from "@components/geojson-preview"

const Geo = ({path, onload = () => {}}) => {
  let geoResult
  try {
    const geoPath = path
    const xhr = new XMLHttpRequest()
    xhr.open("get", geoPath, false)
    xhr.send()
    const responseFile = xhr.response
    geoResult = JSON.parse(responseFile)
    onload()
  } catch (error) {
    console.log("读取GeoJSON失败", error)
  }
  return geoResult ? <GeojsonPreview geojson={geoResult} height={168} className="m8" /> : "读取GeoJSON失败"
}

const Material = ({material, showType}) => {
  console.log(material)
  console.log(Geo)
  switch (showType) {
    case "list":
      return <>list</>
    case "grid":
      return <>grid</>
    case "thumbnail":
      return <>thumbnail</>
    default:
      return null
  }
}

export default observer(Material)
