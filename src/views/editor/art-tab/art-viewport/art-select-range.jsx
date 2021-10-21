import React from 'react'
import {observer} from 'mobx-react-lite'
import w from '@models'

const SelectRange = ({range, scaler, baseOffsetX, baseOffsetY}) => {
  const {x1, y1, x2, y2, target} = range
  const width = x2 - x1
  const height = y2 - y1
  const {editor} = w
  const {isPointerEventsNone} = editor
  const commonStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#07f',
    border: '2px solid white',
  }
  const direction = {
    northwest: {
      ...commonStyle,
      top: -5,
      left: -5,
      cursor: 'nwse-resize',
    },
    north: {
      ...commonStyle,
      borderTop: '2px solid #ffffff',
      top: -5,
      left: (width * scaler - 10) / 2,
      cursor: 'ns-resize',
    },
    northeast: {
      ...commonStyle,
      top: -5,
      left: width * scaler - 5,
      cursor: 'nesw-resize',
    },
    west: {
      ...commonStyle,
      borderLeft: '2px solid #ffffff',
      top: (height * scaler - 10) / 2,
      left: -5,
      cursor: 'ew-resize',
    },
    east: {
      ...commonStyle,
      borderRight: '2px solid #ffffff',
      top: (height * scaler - 10) / 2,
      left: width * scaler - 5,
      cursor: 'ew-resize',
    },
    southwest: {
      ...commonStyle,
      borderLeft: '2px solid #ffffff',
      borderBottom: '2px solid #ffffff',
      top: height * scaler - 5,
      left: -5,
      cursor: 'nesw-resize',
    },
    south: {
      ...commonStyle,
      borderBottom: '2px solid #ffffff',
      top: height * scaler - 5,
      left: (width * scaler - 10) / 2,
      cursor: 'ns-resize',
    },
    southeast: {
      ...commonStyle,
      borderBottom: '2px solid #ffffff',
      borderRight: '2px solid #ffffff',
      top: height * scaler - 5,
      left: width * scaler - 5,
      cursor: 'nwse-resize',
    },
  }
  return (
    <div
      style={{
        transformOrigin: '0px 0px 0px',
        transform: `matrix(1, 0, 0, 1, ${x1 * scaler + baseOffsetX}, ${y1 * scaler + baseOffsetY})`,
      }}
    >
      <div
        className="pa"
        style={{
          width: `${width * scaler}px`,
          height: `${height * scaler}px`,
          outline: '1px solid #07f',
          pointerEvents: isPointerEventsNone ? 'none' : target === 'frame' ? 'none' : 'auto',
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
          range.onMove(e)
        }}
      />
      {Object.entries(direction).map(([key, value]) => (
        <div
          key={key}
          style={value}
          className="pa"
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            range.onScale(e, key)
          }}
        />
      ))}
    </div>
  )
}

export default observer(SelectRange)
