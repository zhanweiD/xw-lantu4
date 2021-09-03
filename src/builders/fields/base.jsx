import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import isDef from "@utils/is-def"
import s from "./base.module.styl"

export const Field = observer(({className, label, labelClassName, childrenClassName, children}) => {
  return (
    <div className={c("fbh mb8 noFieldEvent pr fbac", className)}>
      {isDef(label) && <div className={c("fb2", s.label, labelClassName)}>{label}</div>}
      <div className={c("fb8 pr fbh stopDrag", s.field, childrenClassName)}>{children}</div>
    </div>
  )
})
