import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Section from "@components/section"
import Grid from "@components/grid"
import Modal from "@components/modal"
import Scroll from "@components/scroll"
import Upload from "@components/upload"
import GeojsonPreview from "@components/geojson-preview"
import Icon from "@components/icon"
import IconButton from "@components/icon-button"
import Material from "./material-thumbnail"
import s from "./material-panel.module.styl"

const Geo = ({file, index, folder}) => {
  const xhr = new XMLHttpRequest()
  xhr.open("get", file.preview, false)
  xhr.send()
  const geoResult = JSON.parse(xhr.response)
  return (
    <div className="w100p pr mb30">
      <GeojsonPreview geojson={geoResult} height={200} />
      <IconButton icon="close" iconSize={16} className={c("pa", s.removeButton)} onClick={folder.removeMaterial(index)} />
    </div>
  )
}

const MaterialFolder = ({folder, showType, icon}) => {
  const {materials, files} = folder
  const thumbs = files.map((file, index) => {
    let F
    switch (file.fileType) {
      case "image":
        F = (
          <div key={`${file.preview}.${index}`} className={c(s.thumb, "fbh fbjc fbac pr mb30")}>
            <img src={file.preview} className={c("inlineBlock", s.previewImg)} alt="" />
            <IconButton icon="close" iconSize={16} onClick={() => folder.removeMaterial(index)} className={c("pa", s.removeButton)} />
          </div>
        )
        break
      case "GeoJSON":
        F = <Geo index={index} file={file} folder={folder} />
        break
      default:
        null
    }

    return F
  })
  return (
    <Section icon={icon} className="pl8 pr8 mt8" childrenClassName="pt8" version={3} name={`${folder.folderName}(${folder.materials.length})`} sessionId={`material-folder-${folder.folderId}`}>
      {materials.length === 0 ? (
        <div className={c("mb16 emptyNote")}>
          <div>
            列表还是空空的，点击
            <span
              className="ctSecend hand"
              onClick={() =>
                folder.set({
                  isVisible: true
                })
              }
            >
              上传
            </span>
          </div>
        </div>
      ) : null}
      {showType === "grid-layout" ? (
        <Grid column={4}>
          {materials.map((material) => (
            <Grid.Item key={material.materialId}>
              <Material key={material.materialId} material={material} showType={showType} />
            </Grid.Item>
          ))}
        </Grid>
      ) : (
        materials.map((material) => <Material key={material.materialId} material={material} showType={showType} />)
      )}
      <Modal
        title="上传素材"
        height={500}
        width={800}
        hasMask
        isVisible={folder.isVisible}
        onClose={() => {
          folder.resetUpload()
        }}
        buttons={[
          {
            name: "取消",
            action: () => {
              folder.resetUpload()
            }
          },
          {
            name: "上传",
            action: () => {
              folder.uploadMaterial()
            }
          }
        ]}
      >
        <div className="fbv h100p">
          <section className="fbh h100p p16 m16">
            <aside className={c("fbv h100p fb1 mr16", s.preview)}>
              <div className="lh32">预览({files.length})</div>
              <div className={c("f1", s.thumbs)}>
                <Scroll>{thumbs}</Scroll>
              </div>
            </aside>
            <aside>
              <Upload placeholder="将需要上传的内容拖入下面的区域，或者直接点击选择文件(GeoJson、图片，限5份/次))" accept=".json, .geojson, image/*" onOk={folder.addMaterial}>
                <div className={c("fbh fbac fbjc", s.uploadArea)}>
                  <Icon name="upload" size={64} opacity={0.3} />
                </div>
              </Upload>
            </aside>
          </section>
        </div>
      </Modal>
    </Section>
  )
}

export default observer(MaterialFolder)