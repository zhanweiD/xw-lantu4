import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"

const ArtFrameName = ({frame, onMouseDown}) => {
  const {nameX_, nameY_, isSelected, name} = frame
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
    </div>
  )
}

export default observer(ArtFrameName)
