import React, {useRef} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Icon from "@components/icon"
import Caption from "@components/caption"
import s from "./icon-button.module.styl"

// NOTE classname icon-button是有作用的，用于菜单定位
const IconButton = ({
  icon,
  iconFill,
  iconClassName,
  iconSize,
  buttonSize = 32,
  title,
  className,
  onClick = () => {},
  stopPropagation,
  onMouseOver = () => {},
  onMouseOut = () => {},
  onFocus = () => {},
  onBlur = () => {}
}) => {
  const buttonRef = useRef(null)
  return (
    <Caption content={title}>
      <div
        ref={buttonRef}
        style={{
          width: `${buttonSize}px`,
          height: `${buttonSize}px`
        }}
        className={c(
          "fbh fbac fbjc",
          s.iconButton,
          {
            stopPropagation
          },
          className
        )}
        onClick={(e) => {
          onClick(e, buttonRef.current)
        }}
        onMouseOver={(e) => {
          e.preventDefault()
          onMouseOver(e, buttonRef.current)
        }}
        onMouseOut={(e) => {
          e.preventDefault()
          onMouseOut(e, buttonRef.current)
        }}
        onFocus={(e) => {
          onFocus(e, buttonRef.current)
        }}
        onBlur={(e) => {
          onBlur(e, buttonRef.current)
        }}
      >
        <Icon
          name={icon}
          fill={iconFill}
          className={iconClassName}
          size={iconSize}
        />
      </div>
    </Caption>
  )
}

export default observer(IconButton)
