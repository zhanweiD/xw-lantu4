import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import Tab from "@components/tab"
import Icon from "@components/icon"
import Loading from "@components/loading"
import IconButton from "@components/icon-button"
import w from "@models"
import Modal from "@components/modal"
import Scroll from "@components/scroll"
import {TextField} from "@components/field"
import MaterialFolder from "./material-folder"
import s from "./material-panel.module.styl"
import MaterialToolbar from "./material-toolbar"

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
                  folder.set({
                    isVisible: true
                  })
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
  const [name, setName] = useState("")
  const {sidebar} = w
  const {materialPanel} = sidebar
  const {fetchState, folders, showType, keyword, isVisible, toggleFolderTop, createFolder, removeFolder, exportFolder} =
    materialPanel
  return (
    <Loading data={fetchState}>
      <Tab sessionId="material-panel-tab" bodyClassName="fbv" className="w100p h100p">
        <Tab.Item name={t("materialPanel.materials")}>
          <MaterialToolbar />
          <Scroll className="h100p">
            {folders.length ? (
              folders
                .filter((f) => f.isTop)
                .concat(folders.filter((f) => !f.isTop))
                .map((folder) => (
                  <MaterialFolder
                    icon={
                      <MoreIcon
                        toggleFolderTop={toggleFolderTop}
                        exportFolder={exportFolder}
                        removeFolder={removeFolder}
                        folder={folder}
                      />
                    }
                    key={folder.folderId}
                    folder={folder}
                    showType={showType}
                  />
                ))
            ) : keyword ? (
              <div className={c("m8 emptyNote")}>
                <div className="fbh fbjc">{`抱歉，没有找到与"${keyword}"相关的素材`}</div>
              </div>
            ) : (
              <div className="fbv fbac fbjc mt30 pt30">
                <div className="p10 fbv fbac fs10 lh32">
                  <Icon name="logo" fill="#fff5" size={42} />
                  <div className="ctw52">素材列表还是空空的，点击下面的按钮启程</div>
                  <div
                    className="greenButton noselect"
                    onClick={() => {
                      materialPanel.set({
                        isVisible: true
                      })
                    }}
                  >
                    新建素材文件夹
                  </div>
                </div>
              </div>
            )}
          </Scroll>
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
      <Modal
        title="新建文件夹"
        height={160}
        width={320}
        isVisible={isVisible}
        onClose={() => {
          materialPanel.set({
            isVisible: false
          })
        }}
        buttons={[
          {
            name: "取消",
            action: () => {
              materialPanel.set({
                isVisible: false
              })
              setName("")
            }
          },
          {
            name: "新增",
            action: () => {
              createFolder(name)
              materialPanel.set({
                isVisible: false
              })
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
    </Loading>
  )
}

export default observer(MaterialPanel)
