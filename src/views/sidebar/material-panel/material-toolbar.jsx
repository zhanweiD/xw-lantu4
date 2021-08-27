import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import IconButton from "@components/icon-button"
import w from "@models"
import s from "./material-panel.module.styl"

const MaterialToolbar = () => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {materialPanel} = sidebar
  const {keyword, showType, searchFolders} = materialPanel
  return (
    <div className={c("fbh fbac cfw2 pl8", s.toolbar)}>
      <div className="fb1">
        <input
          type="text"
          value={keyword}
          placeholder={t("searchPlaceholder")}
          onChange={(e) => {
            materialPanel.set({
              keyword: e.target.value
            })
          }}
          onKeyDown={(e) => e.key === "Enter" && searchFolders()}
        />
      </div>
      {keyword && (
        <IconButton
          icon="close"
          title={t("remove")}
          onClick={() => {
            materialPanel.set({
              keyword: ""
            })
            searchFolders()
          }}
        />
      )}
      <IconButton icon="search" className="cfw6" title={t("search")} onClick={searchFolders} />
      <IconButton icon={showType} className="cfw10" title="显示切换" onClick={materialPanel.toggleShowType} />
      <IconButton
        icon="create-material"
        className="cfw12"
        title={t("materialPanel.materialCreate")}
        onClick={(e) => {
          e.stopPropagation()
          materialPanel.set({
            isVisible: true
          })
        }}
      />
    </div>
  )
}

export default observer(MaterialToolbar)
