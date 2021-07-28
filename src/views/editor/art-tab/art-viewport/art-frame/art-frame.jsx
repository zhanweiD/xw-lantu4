import React, {Children, useEffect, useRef} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import {DropTarget} from "@components/drag-and-drop"
// import WaterMark from '@components/watermark'
import Grid from "@waves4/grid"
import {themeConfigs} from "@utils/theme"
import Box from "../box"
import s from "./art-frame.module.styl"

const ArtFrame = ({frame, viewport, option}) => {
  const {frameId, grid, layout, boxes, artId} = frame
  const {projectId, isGridVisible} = viewport
  const gridRef = useRef(null)

  useEffect(() => {
    if (isGridVisible) {
      new Grid({
        container: gridRef.current,
        autoScale: true,
        width: grid.width_,
        height: grid.height_,
        unit: grid.unit_
      }).draw()
    }
  }, [grid.width_, grid.height_, grid.unit_, isGridVisible])
  return (
    <DropTarget
      style={{
        top: `${layout.y - grid.extendY_}px`,
        left: `${layout.x - grid.extendX_}px`,
        width: `${grid.width_}px`,
        height: `${grid.height_}px`
      }}
      className={c("pa art-frame", s.root)}
      acceptKey="CREATE_EXHIBIT_DRAG_KEY"
      data={{
        create: (data) => {
          frame.createBox({
            data,
            artId,
            projectId
          })
        }
      }}
    >
      <div id={`artFramegrid-${frameId}`}>
        <div
          id={`artFrame-${frameId}`}
          className="pa"
          style={{
            top: `${grid.extendY_}px`,
            left: `${grid.extendX_}px`,
            width: `${layout.width}px`,
            height: `${layout.height}px`,
            background: `${themeConfigs[option.basic.themeId].background}`
          }}
        >
          {isGridVisible && (
            <div
              ref={gridRef}
              className={c(s.grid)}
              style={{
                top: `${-grid.extendY_}px`,
                left: `${-grid.extendX_}px`,
                width: `${grid.width_}px`,
                height: `${grid.height_}px`
              }}
            />
          )}
          {/* <WaterMark
          text={option.basic['watermark.value'].value}
          opacity={option.basic['watermark.opacity'].value}
          rotation={option.basic['watermark.rotation'].value}
          zIndex={0}
        /> */}

          {boxes.map((box) =>
            Children.toArray(
              <Box box={box} frame={frame} viewport={viewport} />
            )
          )}
        </div>
      </div>
    </DropTarget>
  )
}

export default observer(ArtFrame)
