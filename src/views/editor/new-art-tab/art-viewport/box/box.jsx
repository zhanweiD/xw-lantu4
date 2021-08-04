import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
// import Exhibit from "@views/public/exhibit"
import s from "./box.module.styl"

const Box = ({box}) => {
  const {layout, isSelected, art_, viewport_, frame_} = box
  const {isBoxBackgroundVisible} = art_
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
        viewport_.toggleSelectRange({
          target: "box",
          selectRange: [
            {
              frameId: frame_.frameId,
              boxIds: [box.boxId]
            }
          ]
        })
      }}
    >
      这里就是我们需要的组件啊！
      {/* <Exhibit box={box} frame={frame} /> */}
    </div>
  )
}

export default observer(Box)
