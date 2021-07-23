import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import s from "./header.module.styl"

const Header = () => {
  return <header className={c("cf3 fbh fbac", s.head)}>header</header>
}

export default observer(Header)
