/**
 * @author 南风
 * @description 素材管理面板
 */
import React, {Children, useRef} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import w from "@models"
import Tab from "@components/tab"
import Grid from "@components/grid"
import Scroll from "@components/scroll"
import Section from "@components/section"
import config from "@utils/config"
import Icon from "@components/icon"
import IconButton from "@components/icon-button"
import Loading from "@components/loading"
import MaterialThumbnail from "./material-thumbnail"
import MaterailToolbar from "./material-toolbar"
import MaterialCreater from "./material-creater"
import s from "./material-panel.module.styl"

const MoreIcon = ({materialPanel, folder, isTop}) => {
  const downloadRef = useRef(null)
  return (
    <div className="pr oh">
      {isTop && <div className={s.delta} />}
      <a style={{display: "none"}} label="download" ref={downloadRef} href={`${config.urlPrefix}material/folder/${folder.folderId}/export`}>
        download
      </a>
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
                  materialPanel.upload(folder.folderId)
                  menu.hide()
                }
              },
              {
                name: `${isTop ? "取消置顶" : "置顶"}文件夹`,
                action: () => {
                  materialPanel.toggleFolderTop(folder, isTop)
                  menu.hide()
                }
              },
              {
                name: "导出文件夹",
                action: () => {
                  downloadRef.current.click()
                  menu.hide()
                }
              },
              {
                name: "删除文件夹",
                action: () => {
                  materialPanel.removeFolderConfirm(folder)
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

const MaterialFolders = observer(({materialPanel, folder, isTop}) => {
  // TODO 多语言
  // const {t} = useTranslation()
  const {toolbar} = materialPanel
  const {materials_, folderName, section, env_, folderId} = folder
  const {session} = env_

  return (
    <Section
      version={3}
      className="pl8 pr8 mt8"
      childrenClassName="pt8"
      icon={<MoreIcon materialPanel={materialPanel} folder={folder} isTop={isTop} />}
      name={`${folderName} (${materials_.length})`}
      sessionId={`material-folder-${folderId}`}
      onFold={(fold) => session.set(section.sectionKey, fold)}
    >
      {materials_.length ? (
        toolbar.showtype === "grid-layout" ? (
          <Grid column={toolbar.showtype === "grid-layout" ? 4 : 1}>
            {materials_.map((material, index) =>
              Children.toArray(
                <Grid.Item>
                  <MaterialThumbnail folder={folder} material={material} toolbar={toolbar} isLast={index === materials_.length - 1} />
                </Grid.Item>
              )
            )}
          </Grid>
        ) : (
          materials_.map((material, index) => Children.toArray(<MaterialThumbnail material={material} toolbar={toolbar} isLast={index === materials_.length - 1} index={index} folder={folder} />))
        )
      ) : (
        <div className={c("mb16 emptyNote")}>
          <div>
            列表还是空空的，点击
            <span className="ctSecend hand" onClick={() => materialPanel.upload(folder.folderId)}>
              上传
            </span>
          </div>
        </div>
      )}
    </Section>
  )
})

const MaterialPanel = () => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {materialPanel} = sidebar
  const {types, folders_, creater, hasMaterial_, toolbar} = materialPanel

  return (
    <>
      {materialPanel.state === "success" ? (
        <>
          <MaterialCreater model={creater} tempLayerKey="materialUploader" />
          <Tab sessionId="material-panel-tab" className="w100p">
            <Tab.Item name={t("materialPanel.materials")}>
              <div className={c("h100p fbv")}>
                <MaterailToolbar types={types} materialPanel={materialPanel} />
                <Scroll>
                  {folders_.topFolders.length ? folders_.topFolders.map((folder) => Children.toArray(<MaterialFolders materialPanel={materialPanel} folder={folder} isTop />)) : ""}

                  {folders_.basicFolders.length ? folders_.basicFolders.map((folder) => Children.toArray(<MaterialFolders materialPanel={materialPanel} folder={folder} />)) : ""}

                  {hasMaterial_ ? (
                    ""
                  ) : toolbar.keyword ? (
                    <div className={c("m8 emptyNote")}>
                      <div className="fbh fbjc">{`抱歉，没有找到与"${toolbar.keyword}"相关的素材`}</div>
                    </div>
                  ) : (
                    <div className="fbv fbac fbjc mt30 pt30">
                      <div className="p10 fbv fbac fs10 lh32">
                        <Icon name="logo" fill="#fff5" size={42} />
                        <div className="ctw52">素材列表还是空空的，点击下面的按钮启程</div>
                        <div className="greenButton noselect" onClick={materialPanel.createFolderConfirm}>
                          新建素材文件夹
                        </div>
                      </div>
                    </div>
                  )}
                </Scroll>
              </div>
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
        </>
      ) : (
        <Loading data={materialPanel.state} />
      )}
    </>
  )
}

export default observer(MaterialPanel)
