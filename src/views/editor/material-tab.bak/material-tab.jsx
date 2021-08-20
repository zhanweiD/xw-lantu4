/**
 * @author 南风
 * @description 素材详情TAB
 */
import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import config from "@utils/config"
import Geo from "@components/geo-preview"
import s from "./material-tab.module.styl"

const MaterialTab = ({material}) => {
  const {type, id} = material
  return (
    <div className={c("p24 wh100p fbv fbjc fbac")} id={`material-thumbnail-${id}`}>
      {type === "image" && (
        <img className={s.thumbnailImage} src={`${config.urlPrefix}material/download/${id}`} alt="" />
      )}
      {type === "GeoJSON" && <Geo path={`${config.urlPrefix}material/download/${id}`} />}
    </div>
  )
}

export default observer(MaterialTab)
