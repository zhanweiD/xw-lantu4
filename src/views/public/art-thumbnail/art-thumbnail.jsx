/**
 * @author 南风
 * @description 项目管理面板-单个大屏
 */
import React, {useRef} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import IconButton from "@components/icon-button"
import Icon from "@components/icon"
import {DragSource, DropTarget} from "@components/drag-and-drop"
import w from "@models"
import s from "./art-thumbnail.module.styl"
import thumbnail from "./tmpl_empty.png"

const SortDragTarget = observer(({children, project, index}) => {
  const targetRef = useRef(null)
  return (
    <DropTarget
      hideOutLine
      acceptKey={`ART_SORT_DRAG_KEY_PROJECTID_${project?.projectId}`}
      data={{changeSort: project?.saveArtSort}}
      hover={(item) => {
        if (!targetRef.current) {
          return
        }
        if (item.index === index) {
          return
        }
        project.moveArtSort(item.index, index)
        item.index = index // 重新赋值index，否则会出现无限交换情况
      }}
    >
      <div ref={targetRef}>{children}</div>
    </DropTarget>
  )
})

const SortDragSource = observer(({art, index, project, children}) => {
  return (
    <DragSource
      key={art.artId}
      onEnd={(dropResult, data) => {
        dropResult.changeSort(data)
      }}
      dragKey={`ART_SORT_DRAG_KEY_PROJECTID_${project?.projectId}`}
      data={{art, index}}
    >
      {children}
    </DragSource>
  )
})

const ArtThumbnail = ({
  project,
  art,
  withoutOptions = false,
  index,
  isLast
}) => {
  const {sidebar} = w
  const {projectPanel} = sidebar
  const {toolbar} = projectPanel

  const DragSort = ({children}) => (
    <SortDragSource art={art} index={index} project={project}>
      <SortDragTarget art={art} index={index} project={project}>
        {children}
      </SortDragTarget>
    </SortDragSource>
  )

  const ArtItem = () => (
    <div
      className={c(
        "w100p fs0",
        s.art,
        toolbar.isThumbnailVisible ? ["pl8 pr8"] : [!isLast && "mb8"]
      )}
      onDoubleClick={art.showDetail}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const menu = w.overlayManager.get("menu")
        menu.show({
          list: [
            {
              name: "编辑",
              action: () => {
                art.showDetail()
                menu.hide()
              }
            },
            {
              name: "预览",
              action: () => {
                art.previewArt()
                menu.hide()
              }
            },
            {
              name: "数据屏详情",
              action: () => {
                art.updateArt()
                menu.hide()
              }
            },
            {
              name: "复制",
              action: () => {
                art.copyArt()
                menu.hide()
              }
            },
            {
              // name: <a className="block" href={`api/v4/waveview/export/art/${art.artId}`}>导出</a>,
              name: "导出",
              action: () => {
                art.exportArt()
                menu.hide()
              }
            },
            {
              name: "删除",
              action: art.remove
            }
          ]
        })
      }}
    >
      {!toolbar.isThumbnailVisible && (
        <img
          src={art.thumbnail || thumbnail}
          alt={art.name}
          className={c("hand w100p", s.thumbnail)}
        />
      )}
      <div className="fbh fbac">
        <div
          className={c(
            "fb1 omit ctw60 fbh fbac fs12 lh24",
            art.isActive_ && s.activeArt
          )}
        >
          {toolbar.isThumbnailVisible ? (
            <Icon fill="#fff5" name="drag" size={10} />
          ) : (
            <div className="p4" />
          )}
          <div className="omit">{art.name}</div>
        </div>
        {!withoutOptions && (
          <>
            <div className={c("fbh")}>
              {art.isOnline && (
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
          </>
        )}
      </div>
    </div>
  )

  return toolbar.isThumbnailVisible ? (
    <DragSort>
      <ArtItem />
    </DragSort>
  ) : (
    <ArtItem />
  )
}

export default observer(ArtThumbnail)
