import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import {DragSource} from "@components/drag-and-drop"
import Geo from "@components/geo-preview"
import Icon from "@components/icon"
import config from "@utils/config"
import w from "@models"
import s from "./material-panel.module.styl"
import isDev from "@utils/is-dev"

const MaterialView = ({material, showType}) => {
  const [onload, setOnload] = useState(false)
  let F
  switch (material.type) {
    case "image":
      F = (
        <img
          className={c("hand", {
            [s.grid]: showType === "grid-layout",
            [s.thumbnail]: showType !== "grid-layout"
          })}
          src={`${config.urlPrefix}material/download/${material.materialId}`}
          draggable={false}
          alt=""
          style={{height: !onload && `${(material.height / material.width) * 270}px`}}
          onLoad={() => setOnload(true)}
        />
      )
      break
    case "GeoJSON":
      F = <Geo path={`${config.urlPrefix}material/download/${material.materialId}`} />
      break
    default:
      null
  }
  return F
}

const Material = ({material, showType}) => {
  return (
    <DragSource
      key={material.materialId}
      onEnd={(dropResult, data, position) => {
        dropResult.createBackground({
          material: data,
          position
        })
      }}
      dragKey="UPDATE_BOX_BACKGROUND_DRAGE_KEY"
      data={material}
    >
      <div
        className={c("oh mr8 ml8")}
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
        {showType !== "list" ? (
          <div
            className={c("cfw6 fbh", {
              [s.gridWrap]: showType === "grid-layout"
            })}
          >
            <MaterialView material={material} showType={showType} />
          </div>
        ) : null}
        {showType !== "grid-layout" ? (
          <div className="fbh fbac lh24 mb8">
            <div
              className={c("fb1 omit ctw60 fbh fbac pl8", {
                [s.activeMaterial]: material.isActive_
              })}
            >
              {showType === "list" && <Icon className="mr4 ml4" fill="#fff5" name="drag" size={10} />}
              <div className="fb1 omit">{material.name}</div>
            </div>
          </div>
        ) : null}
      </div>
    </DragSource>
  )
}

export default observer(Material)
