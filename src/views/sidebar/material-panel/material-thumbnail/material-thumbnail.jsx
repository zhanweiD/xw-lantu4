/**
 * @author 南风
 * @description 素材管理面板-缩略图
 */
import React, {useRef, useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import config from "@utils/config"
import GeojsonPreview from "@components/geojson-preview"
import Icon from "@components/icon"
import w from "@models"
import copy from "@utils/copy"
import {DragSource, DropTarget} from "@components/drag-and-drop"
import Loading from "@components/loading"
import s from "./material-thumbnail.module.styl"

const SortDragTarget = observer(({children, index, folder, targetRef}) => {
  return (
    <DropTarget
      hideOutLine
      acceptKey={`MATERIAL_SORT_DRAG_KEY_${folder.folderId}`}
      data={{changeSort: folder.saveMaterialSort}}
      hover={(item) => {
        if (!targetRef.current) {
          return
        }
        if (item.index === index) {
          return
        }
        folder.moveMaterialSort(item.index, index)
        item.index = index // 重新赋值index，否则会出现无限交换情况
      }}
    >
      {children}
    </DropTarget>
  )
})

const SortDragSource = observer(({material, index, folder, children}) => {
  return (
    <DragSource
      key={material.materialId}
      onEnd={(dropResult, data) => {
        dropResult.changeSort(data)
      }}
      dragKey={`MATERIAL_SORT_DRAG_KEY_${folder.folderId}`}
      data={{material, index}}
    >
      {children}
    </DragSource>
  )
})

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
  return geoResult ? (
    <GeojsonPreview geojson={geoResult} height={168} className="m8" />
  ) : (
    "读取GeoJSON失败"
  )
}

const MaterialView = ({type, id, toolbar}) => {
  const [onload, setOnload] = useState(false)
  let F
  switch (type) {
    case "image":
      F = (
        <img
          className={c(
            toolbar.showtype === "grid-layout" ? s.gridLayoutImg : s.img
          )}
          src={`${config.urlPrefix}material/download/${id}`}
          draggable={false}
          alt=""
          style={{display: !onload && "none"}}
          onLoad={() => setOnload(true)}
        />
      )
      break
    case "GeoJSON":
      F = (
        <Geo
          onload={() => setOnload(true)}
          path={`${config.urlPrefix}material/download/${id}`}
        />
      )
      break
    default:
      break
  }
  return (
    <>
      {F}
      {!onload && (
        <div className="wh100p">
          <Loading data="loading" />
        </div>
      )}
    </>
  )
}

const Material = ({material, toolbar, index, isLast, folder}) => {
  const targetRef = useRef(null)
  const {showtype} = toolbar
  const icon = {
    image: "material-image",
    GeoJSON: "material-geojson"
  }[material.type]

  const DragSort = ({children}) => (
    <SortDragSource material={material} index={index} folder={folder}>
      <SortDragTarget targetRef={targetRef} folder={folder} index={index}>
        {children}
      </SortDragTarget>
    </SortDragSource>
  )

  const MaterialItem = () => (
    <div
      className={c(
        "oh",
        showtype === "list" && s.hoverHighlight,
        showtype === "thumbnail-list" && !isLast && "mb8",
        toolbar.showtype === "grid-layout" && "pa wh100p"
      )}
      onDoubleClick={material.showDetail}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const menu = w.overlayManager.get("menu")
        menu.show({
          list: [
            {
              name: "复制素材ID",
              action: () => {
                copy(material.materialId)
                w.env_.tip.success({content: "复制成功"})
                menu.hide()
              }
            },
            {
              name: "删除",
              action: material.remove
            }
          ]
        })
      }}
    >
      {showtype !== "list" && (
        <div
          className={c(
            "oh fbh fbjc fbac",
            showtype === "grid-layout" ? "h100p" : "cfw6",
            s.thumbnailView
          )}
        >
          <MaterialView
            type={material.type}
            id={material.materialId}
            toolbar={toolbar}
          />
        </div>
      )}
      {showtype !== "grid-layout" && (
        <div className="fbh fbac lh24">
          <div
            className={c(
              "fb1 omit ctw60 fbh fbac",
              showtype === "list" && "pl8 pr8",
              material.isActive_ && s.activeMaterial
            )}
          >
            {showtype === "list" && (
              <Icon className="mr4 ml4" fill="#fff5" name="drag" size={10} />
            )}
            <div className="pr8">
              <Icon name={icon} />
            </div>
            <div className="fb1 omit">{material.name}</div>
          </div>
        </div>
      )}
    </div>
  )

  return showtype === "list" ? (
    <div ref={targetRef} className={s.list}>
      <DragSort>
        <MaterialItem />
      </DragSort>
    </div>
  ) : (
    <MaterialItem />
  )
}

export default observer(Material)
