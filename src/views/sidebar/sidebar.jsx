import React from "react"
import c from "classnames"
import {observer} from "mobx-react-lite"
import s from "./sidebar.module.styl"

const Sidebar = () => {
  // const {sidebar} = w
  return (
    <div className={c("cf2a fbh", s.sidebar)}>
      sidebar
      {/* {sidebar.activePanel === 'projects' && <ProjectPanel />}
      {sidebar.activePanel === 'exhibits' && <ExhibitPanel />}
      {sidebar.activePanel === 'datas' && <DataPanel />}
      {sidebar.activePanel === 'materials' && <MaterialPanel />} */}
    </div>
  )
}

export default observer(Sidebar)
