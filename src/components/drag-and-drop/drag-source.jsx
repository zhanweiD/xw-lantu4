import React from "react"
import {useDrag} from "react-dnd"

const DragSource = ({data, dragKey, onEnd, children, className}) => {
  const style = {
    cursor: "move"
  }
  const [{isDragging}, drag] = useDrag({
    item: {...data},
    type: dragKey,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult()
      if (item && dropResult && onEnd && dropResult.data) {
        onEnd(dropResult.data, item, dropResult.position)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    options: {
      dropEffect: "copy"
    }
  })
  const opacity = isDragging ? 0.4 : 1
  return (
    <div ref={drag} className={className} style={{...style, opacity}}>
      {children}
    </div>
  )
}

export default DragSource
