import React, {Children, useRef} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import w from "@models"
import Tab from "@components/tab"
import Scroll from "@components/scroll"
import Section from "@components/section"
import Icon from "@components/icon"
import IconButton from "@components/icon-button"
import Grid from "@components/grid"
import config from "@utils/config"
import DataToolbar from "./data-toolbar"
import DataThumbnail from "./data-thumbnail"
import s from "./data-panel.module.styl"

const createMenu = (e, button, dataPanel, folder, isTop, type) => {
  e.stopPropagation()
  const menu = w.overlayManager.get("menu")
  const createList = [
    {
      name: "新建Excel",
      action: () => {
        dataPanel.openTabByData({folder, type: "excel"})
        menu.hide()
      }
    },
    {
      name: "新建JSON",
      action: () => {
        dataPanel.openTabByData({folder, type: "json"})
        menu.hide()
      }
    },
    {
      name: "新建API",
      action: () => {
        dataPanel.openTabByData({folder, type: "api"})
        menu.hide()
      }
    },
    {
      name: "新建SQL",
      action: () => {
        dataPanel.openTabByData({folder, type: "database"})
        menu.hide()
      }
    }
  ]
  const list = [
    {
      name: `${isTop ? "取消置顶" : "置顶"}文件夹`,
      action: () => {
        dataPanel.stickyFolder(folder, isTop)
        menu.hide()
      }
    },
    ...createList,
    {
      name: "删除文件夹",
      action: () => {
        // const modal = w.overlayManager.get('fieldModal')

        dataPanel.confirmDeleteFolder(folder)
        menu.hide()
      }
    }
  ]
  menu.toggle({
    attachTo: button,
    list: type === "folder" ? list : createList
  })
}

const MoreIcon = ({dataPanel, folder, isTop}) => {
  const downloadRef = useRef(null)
  return (
    <div className="pr oh">
      {isTop && <div className={s.delta} />}
      <a style={{display: "none"}} label="download" ref={downloadRef} href={`${config.urlPrefix}material/folder/${folder.folderId}/export`}>
        download
      </a>
      <IconButton icon="more" onClick={(e, button) => createMenu(e, button, dataPanel, folder, isTop, "folder")} />
    </div>
  )
}

const DataFolders = observer(({dataPanel, folder, isTop}) => {
  // TODO 多语言
  // const {t} = useTranslation()
  const {toolbar} = dataPanel
  // const {datas_, folderName, section, env_ = {}} = folder
  const {datas_, folderName, section} = folder

  // const {session} = env_

  return (
    <Section
      version={3}
      className="pl8 pr8 mt8"
      childrenClassName="pt8"
      icon={<MoreIcon dataPanel={dataPanel} folder={folder} isTop={isTop} />}
      name={`${folderName} (${datas_.length})`}
      props={section}
      onFold={() => {
        // session.set(section.sectionKey, fold)
      }}
    >
      {datas_.length ? (
        toolbar.showtype === "grid-layout" ? (
          <Grid column={toolbar.showtype === "grid-layout" ? 4 : 1}>
            {datas_.map((data) =>
              Children.toArray(
                <Grid.Item>
                  <DataThumbnail
                    folder={folder}
                    data={data}
                    // toolbar={toolbar}
                    // isLast={index === datas_.length - 1}
                    dataPanel={dataPanel}
                  />
                </Grid.Item>
              )
            )}
          </Grid>
        ) : (
          datas_.map((data) =>
            Children.toArray(
              <DataThumbnail
                data={data}
                dataPanel={dataPanel}
                // toolbar={toolbar}
                // isLast={index === datas_.length - 1}
                // index={index}
                folder={folder}
              />
            )
          )
        )
      ) : (
        <div className={c("mb16 emptyNote")}>
          <div>
            列表还是空空的，点击
            <span className="ctSecend hand" onClick={(e, button) => createMenu(e, button, dataPanel, folder, false, "data")}>
              新建
            </span>
          </div>
        </div>
      )}
    </Section>
  )
})

const DataPanel = () => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {dataPanel} = sidebar
  const {folders_, toolbar, hasData_} = dataPanel

  return (
    <>
      <Tab sessionId="data-panel-tab" className="w100p">
        <Tab.Item name={t("dataPanel.datas")}>
          <div className={c("h100p fbv")}>
            <DataToolbar dataPanel={dataPanel} />
            <Scroll>
              {folders_.topFolders.map((folder) => Children.toArray(<DataFolders dataPanel={dataPanel} folder={folder} isTop />))}
              {folders_.basicFolders.map((folder) => Children.toArray(<DataFolders dataPanel={dataPanel} folder={folder} />))}

              {hasData_ ? (
                ""
              ) : toolbar.keyword ? (
                <div className={c("m8 emptyNote")}>
                  <div className="fbh fbjc">{`抱歉，没有找到与"${toolbar.keyword}"相关的数据`}</div>
                </div>
              ) : (
                <div className="fbv fbac fbjc mt30 pt30">
                  <div className="p10 fbv fbac fs10 lh32">
                    <Icon name="logo" fill="#fff5" size={42} />
                    <div className="ctw52">数据列表还是空空的，点击下面的按钮启程</div>
                    <div className="greenButton noselect" onClick={dataPanel.createFolderConfirm}>
                      新建数据文件夹
                    </div>
                  </div>
                </div>
              )}
            </Scroll>
          </div>
        </Tab.Item>

        <Tab.Item name={t("dataPanel.official")}>
          <div className="fbv fbac fbjc mt30 pt30">
            <div className="p10 fbv fbac fs10 lh32">
              <Icon name="logo" fill="#fff5" size={42} />
              <div className="ctw52">暂无官方数据</div>
            </div>
          </div>
        </Tab.Item>
      </Tab>
    </>
  )
}

export default observer(DataPanel)
