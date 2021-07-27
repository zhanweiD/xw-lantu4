import React, {useRef, useState, useEffect} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import s from "./caption.module.styl"

const Caption = ({children, content, className}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [styles, setStyles] = useState({})
  const nodeRef = useRef(null)

  const getPosition = () => {
    const childRect = nodeRef.current.children[0].getBoundingClientRect()
    const contentRect = nodeRef.current.children[1].getBoundingClientRect()
    let left = childRect.x
    let top = childRect.bottom + 2
    if (childRect.x + contentRect.width > document.body.clientWidth) {
      left = childRect.right - contentRect.width
    }
    if (childRect.bottom + contentRect.height > document.body.clientHeight) {
      top = childRect.y - contentRect.height - 2
    }
    return {
      left,
      top
    }
  }

  const mouseover = () => {
    setIsVisible(true)
    setStyles(getPosition())
  }

  const mouseleave = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    const childNode = nodeRef.current.children[0]
    const contentNode = nodeRef.current.children[1]
    if (childNode && contentNode) {
      // 绑定鼠标移入事件
      childNode.addEventListener("mouseover", mouseover)

      // 绑定鼠标移出事件
      childNode.addEventListener("mouseleave", mouseleave)
    }
    return () => {
      if (childNode && contentNode) {
        childNode.removeEventListener("mouseover", mouseover)
        childNode.removeEventListener("mouseleave", mouseleave)
      }
    }
  })

  return (
    <span ref={nodeRef} className={className}>
      {typeof children === "string" ? <span>{children}</span> : children}
      <span
        style={styles}
        className={c({
          [s.captionMessage]: true,
          [s.nowrap]: typeof content === "string",
          [s.hide]: !(isVisible && content)
        })}
      >
        <div className={c("p6 fs12", s.content)}>{content}</div>
      </span>
    </span>
  )
}

export default observer(Caption)
