/**
 * canFold v3版本样式折叠
 *  v4版本样式折叠
 * Section去除本身默认内部padding，Section组件添加内部padding可用childrenClassName属性或者config文件配置section的padding属性
 */

import React, {useState, useRef, useEffect} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import {session} from "@utils/storage"
import Icon from "@components/icon"
import isDef from "@utils/is-def"
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
  hasAnimation = false,
  icon,
  canFold = true,
  version = 4,
  isFold = false,
  sectionConfigField,
  onFold = () => {},
  tipColor,
  headIcon,
  childrenClassName,
  onClick,
  updateKey
}) => {
  if (allSessionIds[sessionId]) {
    console.warn(`'Section'组件有重复的'sessionId(${sessionId})'出现，请检查`)
  }

  const sessionKey = sessionId ? `section-${sessionId}` : undefined
  const [fold, setFold] = useState(sessionKey ? session.get(sessionKey, isFold) : isFold)
  const [isDrawed, setIsDrawed] = useState(false)
  const contentRef = useRef()
  const heightRef = useRef()

  useEffect(() => {
    if (hasAnimation) {
      heightRef.current = contentRef.current.offsetHeight
      setIsDrawed(true)
    }
  }, [])

  useEffect(() => {
    if (hasAnimation) {
      if (fold) {
        contentRef.current.style.height = 0
      } else {
        // contentRef.current.style.height = `${heightRef.current}px`
        // TODO 待优化，应该是具体数值，scroll时高度会有变化
        contentRef.current.style.height = "auto"
      }
    }
  }, [fold])

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
          [s.root_folded]: fold,
          [s.enterAnimation]: hasAnimation
        },
        className
      )}
      id={id}
    >
      <div
        className={c("fbh cfw10", s.name, {
          h32: version === 3,
          h24: version === 4,
          fbjsb: isDef(sectionConfigField),
          [s.name_folded]: version === 3 && fold,
          [s.name_select]: version === 4,
          [s.name_bottom]: version === 4,
          hand: canFold,
          // 在配置面板里，有一种特殊的section，是隐藏头部的
          hide: hideNameBar === true
        })}
        style={{borderLeftColor: version === 4 ? "none" : tipColor}}
      >
        <div
          className={c("fb1 pr8 omit fbh fbac", {pl8: version === 3})}
          onClick={() => {
            if (canFold === false) return
            sessionKey && session.set(sessionKey, !fold)
            setFold(!fold)
            onFold(!fold)
          }}
        >
          {version === 4 && (
            <IconButton
              icon={fold ? "arrow-right" : "arrow-down"}
              iconFill="#fff"
              iconSize={8}
              buttonSize={24}
              onClick={(e) => {
                e.stopPropagation()
                if (canFold === false) return
                sessionKey && session.set(sessionKey, !fold)
                setFold(!fold)
                onFold(!fold)
              }}
            />
          )}
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
        </div>
        {icon}
        {sectionConfigField}
      </div>
      <div
        ref={contentRef}
        className={c(childrenClassName, {
          oh: hasAnimation,
          [s.foldAnimation]: hasAnimation,
          [s.paddingHide]: hasAnimation && isDrawed && fold,
          hide: !hasAnimation && fold
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default observer(Section)
