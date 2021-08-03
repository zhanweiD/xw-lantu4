import React, {Children, useEffect, useRef} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import w from "@models"
import ArtFrame from "./art-frame"
import ArtFrameName from "./art-frame-name"
import SelectRange from "./art-select-range"
import s from "./art-viewport.module.styl"

const ArtViewport = ({art}) => {
  const {editor} = w
  const {artToolbar, artId, viewport, artOption} = art
  const {id, frames, totalWidth, totalHeight, selectRange, scaler, baseOffsetX, baseOffsetY, initZoom} = viewport
  const tabViewRef = useRef(null)
  useEffect(() => {
    // 初始化可视区域元素尺寸数据，用于Tab内容缩放
    editor.initZoom(tabViewRef.current)
  }, [])
  useEffect(() => {
    // 将整个art缩放到可视区域之内
    initZoom()
  }, [id])
  return (
    <div
      className={c("fb1 oh pr p24 fbh", {
        [s.artViewport]: true
      })}
    >
      <div
        className={c("fb1 pr artViewport", {
          cursorCross: artToolbar.activeTool === "createFrame"
        })}
        ref={tabViewRef}
        onMouseDown={(e) => {
          viewport.onMouseDown(e)
        }}
      >
        <div
          id={`art-viewport-${artId}`}
          className="pa noChartEvent"
          style={{
            width: `${totalWidth}px`,
            height: `${totalHeight}px`
          }}
        >
          {frames.map((frame) => Children.toArray(<ArtFrame frame={frame} viewport={viewport} option={artOption} />))}
        </div>
        {selectRange && <SelectRange baseOffsetX={baseOffsetX} baseOffsetY={baseOffsetY} scaler={scaler} range={selectRange} />}
        {frames.map((frame) =>
          Children.toArray(
            <ArtFrameName
              frame={frame}
              onMouseDown={(e) => {
                viewport.selectItem(frame)
                viewport.toggleSelectRange({
                  target: "frame"
                })
                viewport.selectRange.onMove(e, "center")
              }}
            />
          )
        )}
      </div>
    </div>
  )
}
export default observer(ArtViewport)
