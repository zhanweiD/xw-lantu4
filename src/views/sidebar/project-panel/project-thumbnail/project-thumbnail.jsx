/**
 * @author 南风
 * @description 项目管理面板-单个项目
 */
import React, {Children, useRef} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import IconButton from "@components/icon-button"
import Section from "@components/section"
import ArtThumbnail from "@views/public/art-thumbnail"
import Upload from "@components/upload"
import {DragSource} from "@components/drag-and-drop"
import w from "@models"
import s from "./project-thumbnail.module.styl"

const MoreIcon = ({project, isTop, isRecent}) => {
  const uploadRef = useRef(null)
  return (
    <div className="pr oh">
      {isTop && <div className={s.delta} />}
      <Upload
        accept=".json"
        multiple={false}
        onOk={(files) => {
          project.importArt(files, project.projectId)
        }}
      >
        <div ref={uploadRef} />
      </Upload>
      <IconButton
        icon="more"
        onClick={(e, button) => {
          e.stopPropagation()
          const menu = w.overlayManager.get("menu")
          menu.toggle({
            attachTo: button,
            list: [
              {
                name: "新建数据屏",
                action: () => {
                  project.createArt()
                  menu.hide()
                }
              },
              {
                name: "导入数据屏",
                action: () => {
                  uploadRef.current.click()
                  menu.hide()
                }
              },
              {
                name: "项目详情",
                action: () => {
                  project.updateProject()
                  menu.hide()
                }
              },
              {
                name: !isRecent && (isTop ? "取消置顶项目" : "置顶项目"),
                action: () => {
                  project.projectPanel_.toggleProjectTop(project, isTop)
                  menu.hide()
                }
              }
            ]
          })
        }}
      />
    </div>
  )
}

const ProjectThumbnail = ({project, isTop, isRecent}) => {
  const {projectId, name, arts_, activeArtId} = project
  return (
    <Section
      key={projectId}
      version={3}
      sessionId={`SKProject-${projectId}`}
      name={`${name} (${arts_.length})`}
      className="pl8 pr8 mt8"
      childrenClassName="pt8"
      icon={<MoreIcon project={project} isTop={isTop} isRecent={isRecent} />}
    >
      {arts_.length ? (
        arts_.map((art, index) => {
          return Children.toArray(
            <div className={s.list}>
              <DragSource
                key={art.artId}
                onEnd={(dropResult, data) => {
                  dropResult.create({
                    art: data,
                    source: "art"
                  })
                }}
                dragKey="CREATE_ART_DRAG_KEY"
                data={art}
              >
                <ArtThumbnail
                  index={index}
                  isLast={arts_.length - 1 === index}
                  project={project}
                  art={art}
                  isActive={activeArtId === art?.artId}
                />
              </DragSource>
            </div>
          )
        })
      ) : (
        <div className={c("mb16 emptyNote")}>
          <div>
            项目里还没有创建好的大屏，点击
            <span className="ctSecend hand mb8" onClick={project.createArt}>
              创建
            </span>
          </div>
        </div>
      )}
    </Section>
  )
}

export default observer(ProjectThumbnail)
