import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import {Link} from "react-router-dom"
import Icon from "@components/icon"

const HeadSubNav = ({link = "/", name}) => {
  return (
    <div className={c("w100p fbh fbac mt8 mb8  fs18")}>
      <Link to={link}>
        <div className={c("fbh fbac fbjc ml20 mr20 pl10 pr10")}>
          <Icon name="arrow-left" size={18} className="bold hand" fill="#fff" />
        </div>
      </Link>
      {name}
    </div>
  )
}

export default observer(HeadSubNav)
