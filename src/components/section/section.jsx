/**
 * canFold v3版本样式折叠
 *  v4版本样式折叠
 * Section去除本身默认内部padding，Section组件添加内部padding可用childrenClassName属性或者config文件配置section的padding属性
 */

import React, {useState, useEffect} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import {session} from "@utils/storage"
import Icon from "@components/icon"
import IconButton from "@components/icon-button"
import s from "./section.module.styl"

const allSessionIds = {}

const Section = ({
  id,
  sessionId,
  name,
  hideNameBar = false,
  className,
  children,
  icon,
  canFold = true,
  isFold = false,
  onFold = () => {},
  headIcon,
  childrenClassName,
  onClick,
  updateKey,
  dashed = false
}) => {
  if (allSessionIds[sessionId]) {
    console.warn(`'Section'组件有重复的'sessionId(${sessionId})'出现，请检查`)
  }

  const sessionKey = sessionId ? `section-${sessionId}` : undefined
  const [fold, setFold] = useState(sessionKey ? session.get(sessionKey, isFold) : isFold)

  useEffect(() => {
    if (updateKey) {
      setFold(sessionKey ? session.get(sessionKey, isFold) : isFold)
    }
  }, [updateKey])

  return (
    <div
      className={c(
        "pr w100p animate",
        {
          [s.root_folded]: fold
        },
        className
      )}
      id={id}
    >
      <div
        className={c("fbh h24", s.name_select, s.name_bottom, {
          cfw10: !dashed,
          [s.name]: !dashed,
          hand: canFold,
          // 在配置面板里，有一种特殊的section，是隐藏头部的
          hide: hideNameBar === true
        })}
      >
        <div
          className={c("fb1 pr8 omit fbh fbac")}
          onClick={() => {
            if (canFold === false) return
            sessionKey && session.set(sessionKey, !fold)
            setFold(!fold)
            onFold(!fold)
          }}
        >
          <IconButton
            icon={fold ? "arrow-right" : "arrow-down"}
            iconFill="#fff"
            iconSize={dashed ? 6 : 8}
            buttonSize={24}
            onClick={(e) => {
              e.stopPropagation()
              if (canFold === false) return
              sessionKey && session.set(sessionKey, !fold)
              setFold(!fold)
              onFold(!fold)
            }}
          />

          {headIcon && <Icon name={headIcon} className="mr8" fill="white" size={16} />}
          <div
            className="omit"
            title={name}
            onClick={(e) => {
              if (onClick) {
                e.stopPropagation()
                onClick(e)
              }
            }}
          >
            {name}
          </div>
          {dashed && <div className={c("fb1 ml8 mr16", s.dashed)} />}
        </div>
        {icon}
      </div>
      <div
        className={c(childrenClassName, {
          hide: fold
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default observer(Section)
