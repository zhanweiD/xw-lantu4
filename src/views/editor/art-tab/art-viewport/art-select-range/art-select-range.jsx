import React, {Children} from "react"
import {observer} from "mobx-react-lite"

const SelectRange = ({range, scaler, baseOffsetX, baseOffsetY}) => {
  const {x1, y1, x2, y2, target} = range
  const width = x2 - x1
  const height = y2 - y1
  const commonStyle = {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#07f",
    border: "2px solid white"
  }
  const direction = {
    center: {
      width: `${width * scaler}px`,
      height: `${height * scaler}px`,
      pointerEvents: target === "frame" ? "none" : "auto",
      outline: "1px solid #07f"
    },
    northwest: {
      ...commonStyle,
      top: -5,
      left: -5,
      cursor: "nw-resize"
    },
    north: {
      ...commonStyle,
      borderTop: "2px solid #ffffff",
      top: -5,
      left: (width * scaler - 10) / 2,
      cursor: "n-resize"
    },
    northeast: {
      ...commonStyle,
      top: -5,
      left: width * scaler - 5,
      cursor: "ne-resize"
    },
    west: {
      ...commonStyle,
      borderLeft: "2px solid #ffffff",
      top: (height * scaler - 10) / 2,
      left: -5,
      cursor: "w-resize"
    },
    east: {
      ...commonStyle,
      borderRight: "2px solid #ffffff",
      top: (height * scaler - 10) / 2,
      left: width * scaler - 5,
      cursor: "e-resize"
    },
    southwest: {
      ...commonStyle,
      borderLeft: "2px solid #ffffff",
      borderBottom: "2px solid #ffffff",
      top: height * scaler - 5,
      left: -5,
      cursor: "sw-resize"
    },
    south: {
      ...commonStyle,
      borderBottom: "2px solid #ffffff",
      top: height * scaler - 5,
      left: (width * scaler - 10) / 2,
      cursor: "s-resize"
    },
    southeast: {
      ...commonStyle,
      borderBottom: "2px solid #ffffff",
      borderRight: "2px solid #ffffff",
      top: height * scaler - 5,
      left: width * scaler - 5,
      cursor: "se-resize"
    }
  }
  return (
    <div
      style={{
        transformOrigin: "0px 0px 0px",
        transform: `matrix(1, 0, 0, 1, ${x1 * scaler + baseOffsetX}, ${
          y1 * scaler + baseOffsetY
        })`
      }}
    >
      {Object.entries(direction).map(([key, value]) =>
        Children.toArray(
          <div
            style={value}
            className="pa"
            onMouseDown={(e) => {
              e.stopPropagation()
              e.preventDefault()
              range.onMove(e, key)
            }}
          />
        )
      )}
    </div>
  )
}

export default observer(SelectRange)
