import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import s from "./setting-list.module.styl"
import {InputItem} from "./input-item"

const SettingList = ({header, children, className}) => {
  return (
    <div className={c("cfw4", className)}>
      {header && (
        <div className={c(s.box, s.header, "pt8", "pb8")}>{header}</div>
      )}
      <ul>{children}</ul>
    </div>
  )
}

const Item = ({children, label, action, className, highlight}) => (
  <li
    className={c(s.item, s.box, "fbh fbac fs14 pt12 pb12", className, {
      [s.highlight]: highlight
    })}
  >
    {label && <div className={s.label}>{label}</div>}
    {children}
    {action && <div className={s.actionBox}>{action}</div>}
  </li>
)

SettingList.Item = Item

Item.Input = InputItem

export default observer(SettingList)
