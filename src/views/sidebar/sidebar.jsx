import React from "react"
import c from "classnames"
import {observer} from "mobx-react-lite"
import w from "@models"
import ProjectPanel from "./project-panel"
import ExhibitPanel from "./exhibit-panel"
import DataPanel from "./data-panel"
import MaterialPanel from "./material-panel"
import s from "./sidebar.module.styl"

const Sidebar = () => {
  const {sidebar} = w
  return (
    <div
      className={c("cf2a fbh fbn", {
        [s.sidebar]: sidebar.panels.indexOf(sidebar.activePanel) > -1
      })}
    >
      {sidebar.activePanel === "projects" && <ProjectPanel />}
      {sidebar.activePanel === "exhibits" && <ExhibitPanel />}
      {sidebar.activePanel === "datas" && <DataPanel />}
      {sidebar.activePanel === "materials" && <MaterialPanel />}
    </div>
  )
}

export default observer(Sidebar)
