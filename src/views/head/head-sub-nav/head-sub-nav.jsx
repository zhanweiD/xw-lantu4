import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import {useHistory} from "react-router-dom"
import Icon from "@components/icon"

const history = useHistory()
const HeadSubNav = ({link = "/", name}) => {
  return (
    <div className={c("w100p fbh fbac mt8 mb8  fs18")}>
      <div
        className={c("fbh fbac fbjc ml20 mr20 pl10 pr10")}
        onClick={() => history.push(link)}
      >
        <Icon name="arrow-left" size={18} className="bold hand" fill="#fff" />
      </div>
      {name}
    </div>
  )
}

export default observer(HeadSubNav)
