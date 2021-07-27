import React from "react"
import c from "classnames"
import s from "./panel.module.styl"

const Panel = ({children, className}) => (
  <div className={c("cf2a fbh", s.panel, className)}>{children}</div>
)

export default Panel
