/**
 * @author 南风
 * @description 素材管理面板-搜索工具栏
 */
import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import IconButton from "@components/icon-button"
import w from "@models"
import s from "./material-toolbar.module.styl"

const MaterialToolbar = ({hideCreateButton = false, materialPanel}) => {
  const {t} = useTranslation()
  const {toolbar, creater} = materialPanel
  const {keyword, set, searchMaterials, root_, showtype} = toolbar

  return (
    <div className={c("fbh fbac cfw2 pl8", s.toolbar)}>
      <div className="fb1">
        <input
          type="text"
          value={keyword}
          placeholder={t("searchPlaceholder")}
          onChange={(e) => {
            set("keyword", e.target.value)
          }}
          onBlur={() => !keyword && searchMaterials()}
          onKeyDown={(e) => e.key === "Enter" && searchMaterials()}
        />
      </div>
      <input
        type="file"
        id="folderPicker"
        name="fileList"
        webkitdirectory="true"
        className={s.filepicker}
        onChange={(e) => creater.importFolder(e.target.files)}
      />

      {keyword ? (
        <IconButton
          icon="close"
          title={t("remove")}
          onClick={() => {
            set("keyword", "")
            searchMaterials()
          }}
        />
      ) : (
        ""
      )}

      <IconButton
        icon="search"
        className="cfw6"
        title={t("search")}
        onClick={searchMaterials}
      />
      <IconButton
        icon={showtype}
        className="cfw10"
        title="显示切换"
        onClick={toolbar.toggleshowtype}
      />
      {!hideCreateButton && root_.hasPermission("project.create") && (
        <IconButton
          icon="create-material"
          className="cfw12"
          title={t("materialPanel.materialCreate")}
          onClick={(e, button) => {
            e.stopPropagation()
            const menu = w.overlayManager.get("menu")
            menu.toggle({
              attachTo: button,
              list: [
                {
                  name: "新建文件夹",
                  action: () => {
                    materialPanel.createFolderConfirm()
                    menu.hide()
                  }
                },
                {
                  name: "导入文件夹",
                  action: () => {
                    window.document.querySelector("#folderPicker").click()
                    menu.hide()
                  }
                }
              ]
            })
          }}
        />
      )}
    </div>
  )
}

export default observer(MaterialToolbar)
