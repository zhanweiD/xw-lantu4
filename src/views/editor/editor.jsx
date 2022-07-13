import React from 'react'
import {observer} from 'mobx-react-lite'
// import {useTranslation} from 'react-i18next'
import c from 'classnames'
import w from '@models'
import IconButton from '@components/icon-button'
import Modal from '@components/modal'
import config from '@utils/config'
import EditorTab from './editor-tab'
import s from './editor.module.styl'

const Editor = () => {
  const {editor, overlayManager, sidebar} = w
  const {tabs, activeTabId, updateActiveNote, closeTab, closeAllTabs, closeOtherTabs} = editor
  const {projectPanel} = sidebar
  const {set, isCloseModalVisible} = projectPanel
  // const {t} = useTranslation()

  // const getIconName = (tab) => {
  //   if (tab.type === 'art') {
  //     return 'tab-art'
  //   }
  //   if (tab.type === 'data') {
  //     return `data-${tab.data?.dataType}`
  //   }

  //   if (tab.type === 'material') {
  //     return `material-${tab.tabOptions.materialType.toLocaleLowerCase()}`
  //   }
  // }

  return (
    <div className={c('fb1 fbh', s.editor)}>
      <div className={c('fb1 fbv', s.tab)}>
        <div className={c('fbh cfb10 scrollbar')}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={c('fbh fbac hand', s.tabName, {
                [s.tabName_active]: tab.id === activeTabId,
                ctw: tab.id === activeTabId,
                ctw40: tab.id !== activeTabId,
              })}
            >
              <div
                className="fb1 omit mr8 fbh fbac"
                onContextMenu={(e, button) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const menu = overlayManager.get('menu')
                  menu.toggle({
                    attachTo: button,
                    list:
                      tabs.length > 1
                        ? [
                            {
                              name: '关闭',
                              action: () => {
                                closeTab(tab.id)
                                menu.hide()
                              },
                            },
                            {
                              name: '关闭其他',
                              action: () => {
                                closeOtherTabs(tab.id)
                                menu.hide()
                              },
                            },
                            {
                              name: '关闭全部',
                              action: () => {
                                closeAllTabs()
                                menu.hide()
                              },
                            },
                          ]
                        : [
                            {
                              name: '关闭',
                              action: () => {
                                closeTab(tab.id)
                                menu.hide()
                              },
                            },
                          ],
                  })
                }}
                onClick={() => updateActiveNote(tab.id)}
              >
                {/* <Icon name={getIconName(tab)} className="mr4" /> */}
                {tab.name}
              </div>
              <IconButton
                icon="close"
                iconSize={12}
                className={s.tabCloseIcon}
                onClick={() => {
                  set('isCloseModalVisible', true)
                }}
              />
              <Modal
                width={300}
                title="确认框"
                isVisible={isCloseModalVisible}
                closable={true}
                hasMask={true}
                onClose={() => {
                  // closeTab(tab.id, 'cancel')
                  set('isCloseModalVisible', false)
                }}
                buttons={[
                  {
                    name: '取消',
                    action: () => {
                      closeTab(tab.id, 'cancel')
                      set('isCloseModalVisible', false)
                    },
                  },
                  {
                    name: '确认',
                    action: () => {
                      closeTab(tab.id, 'confirm')
                      set('isCloseModalVisible', false)
                    },
                  },
                ]}
              >
                <div className={s.confirmModal}>
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="exclamation-circle"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    className={s.icon}
                    aria-hidden="true"
                  >
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                    <path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                  </svg>
                  <span>{`是否保存对当前"${tab.name}"的修改？`}</span>
                </div>
              </Modal>
            </div>
          ))}
        </div>
        <div className={c('fb1 oh pr', s.tabContents)}>
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={c('wh100p', s.tabContent, {
                [s.tabContent_active]: tab.id === activeTabId,
              })}
            >
              <EditorTab tab={tab} />
            </div>
          ))}
          {!tabs.length ? (
            // <div className="wh100p fbv fbjc fbac">
            //   <img className={s.logo} src={config[t('login.slogan')]} alt="logo" />
            //   <div className="mt30 pt16">
            //     <div className={c(s.step, 'ctw10 fs18 bold lh40 mb16 center')}>三步轻松新建可视化数据屏</div>
            //     <div className={c(s.step, 'ctw10 fs18 bold lh32')}>STEP1: 新建项目，管理数据和素材(可选)</div>
            //     <div className={c(s.step, 'ctw10 fs18 bold lh32')}>STEP2: 新建数据屏，拖拽组件，制作图表</div>
            //     <div className={c(s.step, 'ctw10 fs18 bold lh32')}>STEP3: 预览确认数据屏效果，发布数据屏</div>
            //   </div>
            // </div>
            <div className={c('wh100p fbv fbjsb fbac', s.initEditor)}>
              <img className={s.logo} src={config.slogan} alt="logo" />
              <img className={s.logo} src={config.bgSteps} alt="steps" />
              <img src={config.bgPie} alt="logo" />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default observer(Editor)
