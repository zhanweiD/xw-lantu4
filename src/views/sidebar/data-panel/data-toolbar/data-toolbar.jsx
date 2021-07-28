import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import IconButton from "@components/icon-button"
import w from "@models"
import s from "./data-toolbar.module.styl"

const DataToolbar = ({dataPanel}) => {
  const {t} = useTranslation()
  // const {keyword, set, searchDatas, createFolderConfirm} = dataPanel
  const {keyword, set, createFolderConfirm} = dataPanel

  return (
    <div className={c("fbh fbac cfw2 pl8", s.toolbar)}>
      <div className="fb1 fbh fbac mr8">
        <input
          type="text"
          value={keyword}
          placeholder={t("searchPlaceholder")}
          onChange={(e) => set("keyword", e.target.value)}
          // onBlur={() => !keyword && searchDatas()}
          // onKeyDown={e => e.key === 'Enter' && searchDatas()}
        />
      </div>

      {keyword ? (
        <IconButton
          icon="close"
          title={t("remove")}
          onClick={() => {
            set("keyword", "")
            // searchDatas()
          }}
        />
      ) : (
        ""
      )}

      <IconButton
        icon="search"
        title={t("search")}
        className="cfw8"
        // onClick={searchDatas}
      />
      <IconButton
        icon="create-data"
        className="cfw12"
        title={t("dataPanel.dataCreate")}
        onClick={(e, button) => {
          e.stopPropagation()
          const menu = w.overlayManager.get("menu")
          menu.toggle({
            attachTo: button,
            list: [
              {
                name: "新建文件夹",
                action: () => {
                  createFolderConfirm()
                  menu.hide()
                }
              }
            ]
          })
        }}
      />
    </div>
  )
}

export default observer(DataToolbar)
