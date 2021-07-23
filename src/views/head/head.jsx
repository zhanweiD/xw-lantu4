import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import s from "./head.module.styl"

const Head = () => {
  return <header className={c("cf3 fbh fbac", s.head)}>header</header>
}

export default observer(Head)
