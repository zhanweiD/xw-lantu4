import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import w from "@models"
import Icon from "@components/icon"
import IconButton from "@components/icon-button"
import config from "@utils/config"
import EditorTab from "./editor-tab"
import s from "./editor.module.styl"

const Editor = () => {
  const {editor, overlayManager} = w
  const {tabs, activeTabId, updateActiveNote, closeTab, closeAllTabs, closeOtherTabs} = editor
  const {t} = useTranslation()

  const getIconName = (tab) => {
    if (tab.type === "art") {
      return "tab-art"
    }
    if (tab.type === "data") {
      return `data-${tab.data?.dataType}`
    }

    if (tab.type === "material") {
      return `material-${tab.tabOptions.materialType.toLocaleLowerCase()}`
    }
  }

  return (
    <div className={c("fb1 fbh", s.editor)}>
      <div className={c("fb1 fbv", s.tab)}>
        <div className={c("fbh cfb10 scrollbar")}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={c("fbh fbac hand", s.tabName, {
                [s.tabName_active]: tab.id === activeTabId,
                ctw: tab.id === activeTabId,
                ctw40: tab.id !== activeTabId
              })}
            >
              <div
                className="fb1 omit mr8 fbh fbac"
                onContextMenu={(e, button) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const menu = overlayManager.get("menu")
                  menu.toggle({
                    attachTo: button,
                    list:
                      tabs.length > 1
                        ? [
                            {
                              name: "关闭",
                              action: () => {
                                closeTab(tab.id)
                                menu.hide()
                              }
                            },
                            {
                              name: "关闭其他",
                              action: () => {
                                closeOtherTabs(tab.id)
                                menu.hide()
                              }
                            },
                            {
                              name: "关闭全部",
                              action: () => {
                                closeAllTabs()
                                menu.hide()
                              }
                            }
                          ]
                        : [
                            {
                              name: "关闭",
                              action: () => {
                                closeTab(tab.id)
                                menu.hide()
                              }
                            }
                          ]
                  })
                }}
                onClick={() => updateActiveNote(tab.id)}
              >
                <Icon name={getIconName(tab)} className="mr4" />
                {tab.name}
              </div>
              <IconButton
                icon="close"
                iconSize={12}
                className={s.tabCloseIcon}
                onClick={() => {
                  closeTab(tab.id)
                }}
              />
            </div>
          ))}
        </div>
        <div className={c("fb1 oh pr", s.tabContents)}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={c("wh100p", s.tabContent, {
                [s.tabContent_active]: tab.id === activeTabId
              })}
            >
              <EditorTab tab={tab} />
            </div>
          ))}
          {!tabs.length ? (
            <div className="wh100p fbv fbjc fbac">
              <img className={s.logo} src={config[t("login.slogan")]} alt="logo" />
              <div className="mt30 pt16">
                <div className={c(s.step, "ctw10 fs18 bold lh40 mb16 center")}>三步轻松新建可视化大屏</div>
                <div className={c(s.step, "ctw10 fs18 bold lh32")}>STEP1: 新建项目，管理数据和素材(可选)</div>
                <div className={c(s.step, "ctw10 fs18 bold lh32")}>STEP2: 新建大屏，拖拽组件，制作图表</div>
                <div className={c(s.step, "ctw10 fs18 bold lh32")}>STEP3: 预览确认大屏效果，发布大屏</div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  )
}

export default observer(Editor)
