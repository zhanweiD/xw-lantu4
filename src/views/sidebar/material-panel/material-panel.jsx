import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import Tab from "@components/tab"
import Icon from "@components/icon"
import Loading from "@components/loading"
import IconButton from "@components/icon-button"
import w from "@models"
import MaterialFolder from "./material-folder"
import s from "./material-panel.module.styl"

const MoreIcon = ({folder, removeFolder, exportFolder, toggleFolderTop}) => {
  return (
    <div className="pr oh">
      {folder.isTop && <div className={s.delta} />}
      <IconButton
        icon="more"
        onClick={(e, button) => {
          e.stopPropagation()
          const menu = w.overlayManager.get("menu")
          menu.toggle({
            attachTo: button,
            list: [
              {
                name: "上传素材",
                action: () => {
                  folder.upload()
                  menu.hide()
                }
              },
              {
                name: `${folder.isTop ? "取消置顶" : "置顶"}文件夹`,
                action: () => {
                  toggleFolderTop(folder)
                  menu.hide()
                }
              },
              {
                name: "导出文件夹",
                action: () => {
                  exportFolder(folder)
                  menu.hide()
                }
              },
              {
                name: "删除文件夹",
                action: () => {
                  removeFolder(folder)
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

const MaterialPanel = () => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {materialPanel} = sidebar
  const {fetchState, folders, showType, keyword, toggleFolderTop, createFolder, removeFolder, exportFolder} = materialPanel
  return (
    <Loading data={fetchState}>
      <Tab sessionId="material-panel-tab" className="w100p">
        <Tab.Item name={t("materialPanel.materials")}>
          {folders.length ? (
            folders
              .filter((f) => f.isTop)
              .concat(folders.filter((f) => !f.isTop))
              .map((folder) => (
                <MaterialFolder
                  icon={<MoreIcon toggleFolderTop={toggleFolderTop} exportFolder={exportFolder} removeFolder={removeFolder} folder={folder} />}
                  key={folder.folderId}
                  folder={folder}
                  showType={showType}
                />
              ))
          ) : keyword ? (
            <div className={c("m8 emptyNote")}>
              <div className="fbh fbjc">{`抱歉，没有找到与"${toolbar.keyword}"相关的素材`}</div>
            </div>
          ) : (
            <div className="fbv fbac fbjc mt30 pt30">
              <div className="p10 fbv fbac fs10 lh32">
                <Icon name="logo" fill="#fff5" size={42} />
                <div className="ctw52">素材列表还是空空的，点击下面的按钮启程</div>
                <div className="greenButton noselect" onClick={createFolder}>
                  新建素材文件夹
                </div>
              </div>
            </div>
          )}
        </Tab.Item>
        <Tab.Item name={t("materialPanel.official")}>
          <div className="fbv fbac fbjc mt30 pt30">
            <div className="p10 fbv fbac fs10 lh32">
              <Icon name="logo" fill="#fff5" size={42} />
              <div className="ctw52">暂无官方素材</div>
            </div>
          </div>
        </Tab.Item>
      </Tab>
    </Loading>
  )
}

export default observer(MaterialPanel)
