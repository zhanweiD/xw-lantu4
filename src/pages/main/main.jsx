import React from "react"
import c from "classnames"
// import {useTranslation} from "react-i18next"
import Header from "@views/head"
import s from "./main.module.styl"

const Main = () => {
  // const {t} = useTranslation()
  return (
    <div className={c("fbv", s.main)}>
      <Header />
    </div>
  )
}

export default Main
