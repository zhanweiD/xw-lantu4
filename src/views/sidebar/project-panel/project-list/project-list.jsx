import {observer} from "mobx-react-lite"
import React, {useRef} from "react"
import c from "classnames"
import ArtThumbnail from "@views/public/art-thumbnail"
import IconButton from "@components/icon-button"
import Section from "@components/section"
import Upload from "@components/upload"
import {DragSource} from "@components/drag-and-drop"
import w from "@models"
import s from "./project-list.module.styl"

// 针对项目的右上角菜单
const MoreIcon = ({project, isTop, isRecent}) => {
  const uploadRef = useRef(null)
  const menu = w.overlayManager.get("menu")
  const onUpload = (files) => project.importArt(files, project.projectId)
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
          action: () => (project.projectPanel_.toggleProjectTop(project, isTop), menu.hide())
        }
      ]
    })
  }
  return (
    <div className="pr oh">
      {isTop && <div className={s.delta} />}
      <Upload accept=".json" multiple={false} onOk={onUpload}>
        <div ref={uploadRef} />
      </Upload>
      <IconButton icon="more" buttonSize={24} onClick={onClickMore} />
    </div>
  )
}

// 模板列表
export const TemplateList = observer(({id, name, arts, icon, children, ...other}) => {
  return (
    <Section
      key={id}
      sessionId={`SKProject-${id}`}
      name={`${name} (${arts.length})`}
      childrenClassName="pt8"
      icon={icon}
    >
      {arts.map((art, index) => (
        <div key={art.artId} className={c("ml8 mr8")}>
          <DragSource
            key={art.artId}
            onEnd={(dropResult, data) => {
              dropResult.create({art: data, source: "art"})
            }}
            dragKey="CREATE_ART_DRAG_KEY"
            data={art}
          >
            <ArtThumbnail art={art} index={index} {...other} />
          </DragSource>
        </div>
      ))}
      {children}
    </Section>
  )
})

// 项目列表
export const ProjectList = observer(({project, children, isTop, isRecent}) => {
  const {projectId, name, arts_} = project
  return (
    <TemplateList
      id={projectId}
      name={name}
      arts={arts_}
      icon={<MoreIcon project={project} isTop={isTop} isRecent={isRecent} />}
      project={project}
    >
      {children}
    </TemplateList>
  )
})
