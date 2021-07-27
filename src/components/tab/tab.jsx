import React, {Children, useState} from "react"
import {observer} from "mobx-react-lite"
import {session} from "@utils/storage"
import c from "classnames"
import s from "./tab.module.styl"

const allSessionIds = {}

const Tab = ({
  children = [],
  className,
  headClassName,
  bodyClassName,
  sessionId,
  tip,
  tipClassName,
  onSwitch = () => {},
  activeIndex = 0
}) => {
  // ! 当只有1个Tab的时候，需要转为数组，否则后续的map方法找不到
  const items = [].concat(
    children.filter ? children.filter((child) => !!child) : children
  )
  if (allSessionIds[sessionId]) {
    console.warn(`'Tab'组件有重复的'sessionId(${sessionId})'出现，请检查`)
  }
  const sessionKey = sessionId ? `tab-${sessionId}` : undefined
  const [currentIndex, setCurrentIndex] = useState(
    sessionKey ? session.get(sessionKey, activeIndex) : activeIndex
  )

  return (
    <div className={c("fbv", s.root, className)}>
      <div className={c("fbh cfb10", s.head, headClassName)}>
        {items.map((child, index) =>
          Children.toArray(
            <div
              className={c("fbh fbac hand", s.name, {
                [s.name_active]: index === currentIndex,
                ctw: index === currentIndex,
                ctw40: index !== currentIndex
              })}
              onClick={() => {
                setCurrentIndex(index)
                sessionKey && session.set(sessionKey, index)
                onSwitch(index)
              }}
            >
              {child.props && child.props.name}
            </div>
          )
        )}
      </div>
      <div className={c("fb1 oh pr", bodyClassName)}>
        {items.map((child, index) =>
          Children.toArray(
            <Item
              currentIndex={index === currentIndex}
              className={child.props.className}
            >
              {tip && <div className={tipClassName}>{tip}</div>}
              {child.props && child.props.children}
            </Item>
          )
        )}
      </div>
    </div>
  )
}

const Item = ({children, currentIndex, className}) => (
  <div
    className={c(
      "wh100p",
      s.content,
      {
        [s.content_active]: currentIndex
      },
      className
    )}
  >
    {children}
  </div>
)

Tab.Item = Item

export default observer(Tab)
