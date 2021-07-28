import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Exhibit from "@views/public/exhibit"
import s from "./box.module.styl"

const Box = ({box, frame, viewport}) => {
  const {layout, isSelected} = box
  const {isBoxBackgroundVisible} = viewport
  return (
    <div
      id={`box-${box.boxId}`}
      className={c("pa box", {
        [s.boxBackgroundColor]: isBoxBackgroundVisible,
        [s.outline]: isSelected
      })}
      style={{
        top: `${layout.y}px`,
        left: `${layout.x}px`,
        width: `${layout.width}px`,
        height: `${layout.height}px`
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        viewport.selectNone()
        viewport.toggleSelectRange({
          target: "box",
          selectRange: [
            {
              frameId: frame.frameId,
              boxIds: [box.boxId]
            }
          ]
        })
      }}
    >
      <Exhibit box={box} frame={frame} />
    </div>
  )
}

export default observer(Box)
