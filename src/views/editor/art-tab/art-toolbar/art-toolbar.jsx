import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import IconButton from "@components/icon-button"
import s from "./art-toolbar.module.styl"

// 大屏编辑区域的工具条
const ArtToolbar = ({artToolbar}) => {
  return (
    <div className={c(s.toolbar)}>
      <IconButton
        icon="mouse-select"
        title="选择(V)"
        className={c(s.toolbarButton, {
          [s.toolbarButton_active]: artToolbar.activeTool === "select"
        })}
        onClick={() => {
          artToolbar.set("activeTool", "select")
        }}
      />
      <IconButton
        icon="create-artboard"
        title="新建画布(A)"
        className={c(s.toolbarButton, {
          [s.toolbarButton_active]: artToolbar.activeTool === "createFrame"
        })}
        onClick={() => {
          artToolbar.set("activeTool", "createFrame")
        }}
      />
    </div>
  )
}

export default observer(ArtToolbar)
