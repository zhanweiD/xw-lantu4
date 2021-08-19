import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import IconButton from "@components/icon-button"
import w from "@models"
import s from "./material-panel.module.styl"
import Modal from "@components/modal"
import {TextField} from "@components/field"

const MaterialToolbar = () => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {materialPanel} = sidebar
  const {keyword, showType, searchMaterials} = materialPanel
  const [isVisible, setIsVisible] = useState(false)
  const [name, setName] = useState("")
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
          onKeyDown={(e) => e.key === "Enter" && searchMaterials()}
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
            // searchMaterials()
          }}
        />
      )}
      <IconButton icon="search" className="cfw6" title={t("search")} />
      <IconButton icon={showType} className="cfw10" title="显示切换" onClick={materialPanel.toggleShowType} />
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
                  // materialPanel.createFolder()
                  setIsVisible(true)
                  menu.hide()
                }
              },
              {
                name: "导入文件夹",
                action: () => {
                  // window.document.querySelector("#folderPicker").click()
                  menu.hide()
                }
              }
            ]
          })
        }}
      />
      <Modal
        title="新建文件夹"
        height={160}
        width={320}
        isVisible={isVisible}
        onClose={() => {
          setIsVisible(false)
        }}
        buttons={[
          {
            name: "取消",
            action: () => {
              setIsVisible(false)
              setName("")
            }
          },
          {
            name: "新增",
            action: () => {
              materialPanel.createFolder(name)
              setIsVisible(false)
              setName("")
            }
          }
        ]}
      >
        <TextField
          value={name}
          onChange={(value) => {
            setName(value)
          }}
          className="pt8 pb8"
          label={t("name")}
          placeholder="文件夹名称不能为空、重复"
        />
      </Modal>
    </div>
  )
}

export default observer(MaterialToolbar)
