import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import GeojsonPreview from "@components/geojson-preview"
import Icon from "@components/icon"
import config from "@utils/config"
import w from "@models"
import s from "./material-panel.module.styl"
import isDev from "@utils/is-dev"

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
  return geoResult ? <GeojsonPreview className="m8 hand" geojson={geoResult} height={168} /> : "读取GeoJSON失败"
}

const MaterialView = ({material}) => {
  const [onload, setOnload] = useState(false)
  let F
  switch (material.type) {
    case "image":
      F = (
        <img
          className={c("hand", s.thumbnail)}
          src={`${config.urlPrefix}material/download/${material.materialId}`}
          draggable={false}
          alt=""
          style={{display: !onload && "none"}}
          onLoad={() => setOnload(true)}
        />
      )
      break
    case "GeoJSON":
      F = <Geo onload={() => setOnload(true)} path={`${config.urlPrefix}material/download/${material.materialId}`} />
      break
    default:
      null
  }
  return F
}

const Material = ({material, showType}) => {
  const icon = {
    image: "material-image",
    GeoJSON: "material-geojson"
  }[material.type]
  return (
    <div
      className={c("oh")}
      onDoubleClick={material.showDetail}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const menu = w.overlayManager.get("menu")
        const list = [
          {
            name: "删除",
            action: () => {
              material.remove()
              menu.hide()
            }
          }
        ]
        isDev &&
          list.unshift({
            name: "复制素材ID",
            action: () => {
              material.copyId()
              menu.hide()
            }
          })
        menu.show({list})
      }}
    >
      {showType !== "list" ? <MaterialView material={material} /> : null}
      {showType !== "grid" ? (
        <div className="fbh fbac lh24">
          <div
            className={c(
              "fb1 omit ctw60 fbh fbac"
              // material.isActive_ && s.activeMaterial
            )}
          >
            {showType === "list" && <Icon className="mr4 ml4" fill="#fff5" name="drag" size={10} />}
            <div className="pr8">
              <Icon name={icon} />
            </div>
            <div className="fb1 omit">{material.name}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default observer(Material)
