/**
 * @author 南风
 * @description 素材管理面板-创建素材弹出层
 */
import React, {Children} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Scroll from "@components/scroll"
import Upload from "@components/upload"
import Icon from "@components/icon"
import IconButton from "@components/icon-button"
import GeojsonPreview from "@components/geojson-preview"
import Overlay from "@components/overlay"
import w from "@models"
import s from "./material-creater.module.styl"

const Geo = ({file, model, index}) => {
  const xhr = new XMLHttpRequest()
  xhr.open("get", file.preview, false)
  xhr.send()
  const geoResult = JSON.parse(xhr.response)
  return (
    <div className="w100p pr mb30">
      <GeojsonPreview geojson={geoResult} height={200} />
      <IconButton
        icon="close"
        iconSize={16}
        onClick={() => model.remove(index)}
        className={c("pa", s.removeButton)}
      />
    </div>
  )
}

const MaterialCreate = ({model, tempLayerKey = "materialUploader"}) => {
  const materialImageCreater = w.overlayManager.get("materialModal")

  const fileType = model.fileTypes.find(
    (file) => file.tempLayerKey === tempLayerKey
  )

  const thumbs = model.files.map((file, index) => {
    let F = null
    switch (file.fileType) {
      case "image":
        F = (
          <div className={c(s.thumb, "fbh fbjc fbac pr mb30")}>
            <img
              src={file.preview}
              className={c("inlineBlock", s.previewImg)}
              alt=""
            />
            <IconButton
              icon="close"
              iconSize={16}
              onClick={() => model.remove(index)}
              className={c("pa", s.removeButton)}
            />
          </div>
        )
        break
      case "GeoJSON":
        F = <Geo model={model} index={index} file={file} />
        break
      default:
        break
    }

    return Children.toArray(F)
  })

  return (
    <Overlay
      model={materialImageCreater}
      buttons={[
        {
          name: "取消",
          action: () => materialImageCreater.hide()
        },
        {
          name: "添加",
          action: model.create,
          disable: model.state === "success"
        }
      ]}
    >
      <div className="fbv h100p">
        <section className="fbh h100p p16 m16">
          <aside className={c("fbv h100p fb1 mr16", s.preview)}>
            <div className="lh32">预览({model.files.length})</div>
            <div className={c("f1", s.thumbs)}>
              <Scroll>{thumbs}</Scroll>
            </div>
          </aside>
          <aside>
            <Upload
              placeholder={fileType.tips}
              accept={fileType.accept}
              onOk={model.add}
            >
              <div className={c("fbh fbac fbjc", s.uploadArea)}>
                <Icon name="upload" size={64} opacity={0.3} />
              </div>
            </Upload>
          </aside>
        </section>
      </div>
    </Overlay>
  )
}

export default observer(MaterialCreate)
