import React from "react"
import c from "classnames"
import {observer} from "mobx-react-lite"

import s from "./sidebar.module.styl"

const Sidebar = () => {
  return <div className={c("cf2a fbh", s.sidebar)}>sidebar</div>
}

export default observer(Sidebar)
