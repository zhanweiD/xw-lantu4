import React from "react"
import c from "classnames"
import Head from "@views/head"
import HeadSubNav from "@views/head/head-sub-nav"
import Loading from "@components/loading"
import s from "./manage-container.module.styl"

const ManageContainer = ({children, loading, link, name}) => {
  if (loading) {
    return (
      <div className="w100p h100v fbv fbjc fbac">
        <Loading data="loading" />
      </div>
    )
  }
  return (
    <>
      <div className={c(s.main, "fbv")}>
        <div>
          <Head showTabs={false} />
        </div>
        <div>
          <HeadSubNav link={link} name={name} />
        </div>
        <div className="fb1 scrollbar h0">
          <div className={c(s.container)}>{children}</div>
        </div>
      </div>
    </>
  )
}

export default ManageContainer
