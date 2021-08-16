import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"

const ArtFrameName = ({isSelected, frame, onMouseDown = () => {}}) => {
  const {nameX_, nameY_, name, recreateFrame, isCreateFail} = frame
  return (
    <div
      className={c("pa hand artframeName")}
      style={{
        transform: `matrix(1, 0, 0, 1, ${nameX_}, ${nameY_})`
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        onMouseDown(e)
      }}
    >
      {name} {isSelected && "(selected)"}
      {isCreateFail && <div onClick={recreateFrame}>重新创建好吗？</div>}
    </div>
  )
}

export default observer(ArtFrameName)
