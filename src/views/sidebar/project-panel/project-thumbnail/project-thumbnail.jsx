import {DragSource} from "@components/drag-and-drop"
import IconButton from "@components/icon-button"
import Section from "@components/section"
import Upload from "@components/upload"
import w from "@models"
import ArtThumbnail from "@views/public/art-thumbnail"
import c from "classnames"
import {observer} from "mobx-react-lite"
import React, {useRef} from "react"
import s from "./project-thumbnail.module.styl"

const MoreIcon = ({project, isTop, isRecent}) => {
  const uploadRef = useRef(null)
  const menu = w.overlayManager.get("menu")
  const onUploadOK = (files) => project.importArt(files, project.projectId)
  const onClickMore = (e, button) => {
    e.stopPropagation()
    menu.toggle({
      attachTo: button,
      list: [
        {name: "新建数据屏", action: () => (project.createArt(), menu.hide())},
        {name: "导入数据屏", action: () => (uploadRef.current.click(), menu.hide())},
        {name: "项目详情", action: () => (project.editProject(), menu.hide())},
        {
          name: !isRecent && (isTop ? "取消置顶项目" : "置顶项目"),
          action: () => {
            project.projectPanel_.toggleProjectTop(project, isTop)
            menu.hide()
          }
        }
      ]
    })
  }
  return (
    <div className="pr oh">
      {isTop && <div className={s.delta} />}
      <Upload accept=".json" multiple={false} onOk={onUploadOK}>
        <div ref={uploadRef} />
      </Upload>
      <IconButton icon="more" onClick={onClickMore} />
    </div>
  )
}

const ProjectThumbnail = ({project, isTop, isRecent}) => {
  const {projectId, name, arts_, activeArtId} = project
  return (
    <Section
      version={3}
      key={projectId}
      sessionId={`SKProject-${projectId}`}
      name={`${name} (${arts_.length})`}
      className="pl8 pr8 mt8"
      childrenClassName="pt8"
      icon={<MoreIcon project={project} isTop={isTop} isRecent={isRecent} />}
    >
      {arts_.map((art, index) => (
        <div key={art.artId} className={s.list}>
          <DragSource
            key={art.artId}
            onEnd={(dropResult, data) => dropResult.create({art: data, source: "art"})}
            dragKey="CREATE_ART_DRAG_KEY"
            data={art}
          >
            <ArtThumbnail
              art={art}
              index={index}
              project={project}
              isLast={arts_.length - 1 === index}
              isActive={activeArtId === art.artId}
            />
          </DragSource>
        </div>
      ))}
      {!arts_.length && (
        <div className={c("mb16 emptyNote")}>
          项目里还没有创建好的大屏，点击
          <span className="ctSecend hand mb8" onClick={project.createArt}>
            创建
          </span>
        </div>
      )}
    </Section>
  )
}

export default observer(ProjectThumbnail)
