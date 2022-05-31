import React from 'react'
import {useDrop} from 'react-dnd'
import {observer} from 'mobx-react-lite'
import c from 'classnames'

/**
 * 接受放置拖拽源
 */
const DropTarget = ({acceptKey, children, style, data, className, disabled, hover = () => {}, hideOutLine}) => {
  const [{canDrop, isOver}, drop] = useDrop({
    accept: acceptKey,
    hover: (item, monitor) => hover(item, monitor, drop),
    // 拖拽完成后，源组件接受的目标容器数据
    drop: (props, monitor) => {
      const position = monitor.getClientOffset()
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }
      return {
        position,
        data,
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop() && !disabled,
    }),
  })
  const isActive = canDrop && isOver
  let outline = ''
  let cursor = ''
  if (isActive) {
    outline = !hideOutLine && '1px dashed rgba(0,255,0,0.8)'
  } else if (canDrop) {
    outline = !hideOutLine && '1px dashed rgba(0,255,0,0.4)'
    cursor = 'copy'
  }

  // 父节点可能会设置 pointerEvent:none ，所以当容器为可放置状态，设置 pointerEvent: auto
  const pointerEvents = {}
  if (canDrop) {
    pointerEvents.pointerEvents = 'auto'
  }
  return (
    <div ref={drop} className={c(className)} style={{...style, outline, cursor, ...pointerEvents}}>
      {children}
    </div>
  )
}

export default observer(DropTarget)
