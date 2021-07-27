import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
// import Icon from '@components/icon'
import isDef from "@utils/is-def"
import IconButton from "@components/icon-button"
import isArray from "lodash/isArray"
import s from "./construct-section.module.styl"

const ConstructSection = ({
  id,
  name,
  hideNameBar = false,
  type,
  isHide = false,
  isDisabled = false,
  isFocus = false,
  className,
  nameClassName,
  isFold = false,
  isVisible = true,
  buttons = [],
  showEyeIcon = false,
  onFold = () => {},
  onClick = () => {},
  tipColor = "rgb(136, 136, 136)",
  paddingLeft,
  onEyeClick = () => {},
  onContextMenu = () => {},
  onSelect = () => {}
}) => {
  const [selfFold, setSelfFold] = useState(isFold)
  const [icons, setIcons] = useState({})
  const [selfVisible, setSelfVisible] = useState(isVisible)

  // 区分组和layer，以后layer也保存时去掉
  const visibility = hideNameBar ? selfVisible : isVisible

  return (
    <div
      className={c(
        "pr animate",
        s.root,
        {
          hide: isHide
        },
        className
      )}
      id={id}
    >
      <div
        className={c("fbh h24", s.name, {
          fbjsb: buttons.length > 0,
          [s.name_background]: !hideNameBar && !isFocus,
          [s.name_focus]: isFocus,
          [s.name_focus_unVisible]: !visibility || isDisabled,
          noEvent: isDisabled
        })}
        style={{paddingLeft, borderLeftColor: tipColor}}
      >
        <div
          className={c("fb1 omit fbh fbac hand", nameClassName)}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
            onClick(e)
          }}
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onContextMenu(e)
          }}
        >
          <IconButton
            className={c({[s.hideIcon]: hideNameBar})}
            icon={selfFold ? "arrow-right" : "arrow-down"}
            iconFill="#fff"
            iconSize={8}
            buttonSize={24}
            onClick={(e) => {
              if (hideNameBar) return
              e.stopPropagation()
              setSelfFold(!selfFold)
              onFold(!selfFold)
            }}
          />
          <div className="omit">{name}</div>
        </div>
        {type === "wave" && (
          <div className={c("fbh fbje pa", s.right0)}>
            {buttons.map((button) => {
              let showIcon
              const {icon, disabled = false, key, action} = button
              if (isArray(icon)) {
                showIcon = isDef(icons[key])
                  ? icons[key]
                    ? icon[1]
                    : icon[0]
                  : disabled
                  ? icon[1]
                  : icon[0]
              } else {
                showIcon = icon
              }
              return (
                <IconButton
                  key={key}
                  icon={showIcon}
                  iconFill="#fff"
                  buttonSize={24}
                  onClick={(e) => {
                    const copyIcons = JSON.parse(JSON.stringify(icons))
                    copyIcons[key] = !copyIcons[key]
                    setIcons(copyIcons)
                    action(id, e)
                  }}
                />
              )
            })}
            {showEyeIcon && (
              <IconButton
                icon={visibility ? "eye-open" : "eye-close"}
                iconFill="#fff"
                buttonSize={24}
                onClick={(e) => {
                  e.stopPropagation()
                  hideNameBar && setSelfVisible(!visibility)
                  onEyeClick(!visibility)
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default observer(ConstructSection)
