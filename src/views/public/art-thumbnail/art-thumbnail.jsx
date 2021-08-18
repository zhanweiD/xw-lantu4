import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import IconButton from "@components/icon-button"
import Icon from "@components/icon"
import {DragSource, DropTarget} from "@components/drag-and-drop"
import w from "@models"
import s from "./art-thumbnail.module.styl"
import thumbnail from "./thumbnail.png"

const Sortable = observer(({art, index, project, children}) => {
  return (
    <DragSource
      key={art.artId}
      onEnd={(dropResult, data) => dropResult.changeSort(data)}
      dragKey={`ART_SORT_DRAG_KEY_PROJECTID_${project?.projectId}`}
      data={{art, index}}
    >
      <DropTarget
        hideOutLine
        acceptKey={`ART_SORT_DRAG_KEY_PROJECTID_${project?.projectId}`}
        data={{changeSort: project?.saveArtSort}}
        hover={(item) => {
          if (item.index !== index) {
            project.moveArtSort(item.index, index)
            // 重新赋值index，否则会出现无限交换情况
            item.index = index
          }
        }}
      >
        {children}
      </DropTarget>
    </DragSource>
  )
})

const ArtThumbnail = ({project, art, withoutOptions = false, index}) => {
  const {sidebar} = w
  const {projectPanel} = sidebar
  const {toolbar} = projectPanel
  const {isThumbnailVisible} = toolbar
  const mThumbnail = art.thumbnail || thumbnail
  const menu = w.overlayManager.get("menu")
  return (
    <Sortable art={art} index={index} project={project}>
      <div
        className={c("w100p fs0", s.art, isThumbnailVisible ? "mb8" : "pl8 pr8")}
        onDoubleClick={art.editArt}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          menu.show({
            list: [
              {name: "编辑", action: () => (art.editArt(), menu.hide())},
              {name: "预览", action: () => (art.previewArt(), menu.hide())},
              {name: "数据屏详情", action: () => (art.showDetial(), menu.hide())},
              {name: "保存为模板", action: () => (art.saveAsTemplate(), menu.hide())},
              {name: "更新缩略图", action: () => (art.updateThumbnail(), menu.hide())},
              {name: "复制", action: () => (art.copyArt(), menu.hide())},
              {name: "导出", action: () => (art.exportArt(), menu.hide())},
              {name: "删除", action: () => (art.removeArt(), menu.hide())}
            ]
          })
        }}
      >
        {isThumbnailVisible && <img src={mThumbnail} alt={art.name} className={c("hand w100p", s.thumbnail)} />}
        <div className="fbh fbac">
          <div className={c("fb1 omit ctw60 fbh fbac fs12 lh24", art.isActive_ && s.activeArt)}>
            {!isThumbnailVisible ? <Icon fill="#fff5" name="drag" size={10} /> : <div className="p4" />}
            <div className="omit">{art.name}</div>
          </div>
          {!withoutOptions && (
            <div className={c("fbh")}>
              {art.isPublished && (
                <IconButton
                  buttonSize={24}
                  className={s.toolIconHighlight}
                  icon="publish"
                  iconFill="#7BD100"
                  title="已发布"
                  onClick={art.previewPublishArt}
                />
              )}
              <IconButton
                buttonSize={24}
                className={s.toolIconHighlight}
                icon="preview"
                title="预览"
                onClick={art.previewArt}
              />
            </div>
          )}
        </div>
      </div>
    </Sortable>
  )
}

export default observer(ArtThumbnail)
