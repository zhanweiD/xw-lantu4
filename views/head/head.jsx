import React, {Children, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import w from '@models'
import IconGroupButton from '@components/icon-group-button'
import Icon from '@components/icon'
import s from './head.module.styl'
import PanelButton from './panel-button'
import {session} from '@utils/storage'

const Head = () => {
  const {t} = useTranslation()
  const {head, editor, optionPanel, user} = w
  const {logout} = user
  const {panelButtons, activePanelButton} = head
  const {activeTabId, tabs, isOptionPanelVisible_} = editor
  const activeTab = tabs.filter((tab) => tab.id === activeTabId)[0] || {}
  const {type, art} = activeTab
  const {viewport, isGridVisible, isBoxBackgroundVisible, isSnap} = art || {}
  const {selectRange} = viewport || {}
  const buttonRef = useRef(null)
  let size = 0
  if (selectRange) {
    if (selectRange.range.length > 1) {
      size = 0
    } else {
      size = selectRange.range.reduce((total, current) => {
        return total + current.boxIds.length
      }, 0)
    }
  }

  return (
    <div className={c('cf3 fbh fbac pr8', s.head)}>
      <div className={c('fb1 fbh fbac')}>
        <div className={c('fbh fbac', s.maxWidth)} ref={buttonRef}>
          <PanelButton
            name={
              <div className="fbh fbac fbjc h40 w40">
                <Icon name="waveview" size={24} />
              </div>
            }
            className={c('omit')}
            style={{padding: 0}}
            connerMark="canner-mark"
            onClick={(e) => {
              e.stopPropagation()
              const menu = w.overlayManager.get('menu')
              menu.toggle({
                attachTo: buttonRef.current,
                list: [
                  {
                    name: '退出登录',
                    action: () => {
                      session.remove()
                      logout()
                      window.location.reload()
                    },
                  },
                ],
              })
            }}
          />
        </div>

        {panelButtons.map((panel) =>
          Children.toArray(
            <PanelButton
              name={t(panel)}
              active={activePanelButton === panel}
              onClick={() => {
                head.toggleActivePanel(panel)
                if (art) {
                  setTimeout(() => {
                    art.viewport.resizeViewport()
                  }, 60)
                }
              }}
            />
          )
        )}
      </div>

      {type === 'art' && (
        <>
          <IconGroupButton
            icon="lodestone"
            title="开启吸附"
            canUse={isSnap}
            canClick
            onClick={() => {
              art.set('isSnap', !isSnap)
            }}
          />
          <IconGroupButton
            icon="zoom-0"
            title="将主画布或选中画布缩放到视图"
            canUse
            canClick
            onClick={() => {
              if (art) {
                art.viewport.zoomSingleToView()
              }
            }}
            layout="start"
          />
          <IconGroupButton
            icon="zoom-1"
            title="将所有画布缩放到视图"
            canUse
            canClick
            onClick={() => {
              if (art) {
                art.viewport.zoomAllToView()
              }
            }}
            layout="end"
          />

          <IconGroupButton
            icon="horizontal-equalization"
            title="水平均分"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAverage('horizontal')
            }}
            layout="start"
          />

          <IconGroupButton
            icon="vertical-equalization"
            title="垂直均分"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAverage('vertical')
            }}
            layout="end"
          />

          <IconGroupButton
            icon="space-horizontally"
            title="水平间隔"
            canUse={size > 2}
            canClick={size > 2}
            onClick={() => {
              selectRange.updateSpace('horizontal')
            }}
            layout="start"
          />

          <IconGroupButton
            icon="space-vertically"
            title="垂直间隔"
            canUse={size > 2}
            canClick={size > 2}
            onClick={() => {
              selectRange.updateSpace('vertical')
            }}
            layout="end"
          />
          <IconGroupButton
            icon="left-align"
            title="左对齐"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign('left')
            }}
            layout="start"
          />
          <IconGroupButton
            icon="center-horizontally-align"
            title="水平居中"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign('center')
            }}
            layout="center"
          />
          <IconGroupButton
            icon="right-align"
            title="右对齐"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign('right')
            }}
            layout="center"
          />
          <IconGroupButton
            icon="top-align"
            title="顶对齐"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign('top')
            }}
            layout="center"
          />
          <IconGroupButton
            icon="center-vertical-align"
            title="垂直居中"
            canUse={size > 1}
            onClick={() => {
              selectRange.updateAlign('middle')
            }}
            layout="center"
          />
          <IconGroupButton
            icon="bottom-align"
            title="底对齐"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign('bottom')
            }}
            layout="end"
          />
          <IconGroupButton
            icon="grid"
            title="显示/隐藏网格"
            canUse={isGridVisible}
            canClick
            onClick={() => {
              art.set({
                isGridVisible: !isGridVisible,
              })
            }}
            layout="start"
          />
          <IconGroupButton
            icon="container"
            title="显示/隐藏容器"
            canUse={isBoxBackgroundVisible}
            canClick
            onClick={() => {
              art.set({
                isBoxBackgroundVisible: !isBoxBackgroundVisible,
              })
            }}
            layout="end"
          />
          <IconGroupButton
            icon="preview"
            title="预览"
            canUse
            canClick
            onClick={() => {
              art.preview()
            }}
            layout="start"
          />
          <IconGroupButton
            icon="publish"
            title="发布管理"
            canUse
            canClick
            onClick={() => {
              art.set({
                isArtPublishInfoVisible: true,
              })
            }}
            layout="center"
          />
          <IconGroupButton
            icon="upload"
            title="部署管理"
            canUse
            canClick
            onClick={() => {
              art.set({
                isVersionManagementVisible: true,
              })
            }}
            layout="end"
          />

          <IconGroupButton
            icon="global-set"
            title="配置面板"
            canUse
            canClick
            isHighlight={false}
            layout="start"
            onClick={() => {
              optionPanel.toggle()
              if (art) {
                setTimeout(() => {
                  art.viewport.resizeViewport()
                }, 60)
              }
            }}
          />
          {/* <IconGroupButton
            icon="selected"
            title="选中元素配置面板"
            canUse
            canClick
            isHighlight={true}
            layout="center"
            onClick={() => {
              // optionPanel.toggle()
              // if (art) {
              //   setTimeout(() => {
              //     art.viewport.resizeViewport()
              //   }, 60)
              // }
            }}
          /> */}
          {/* <IconGroupButton
            icon="layer"
            title="图层面板"
            canUse
            canClick
            isHighlight={false}
            layout="end"
            onClick={() => {
              // optionPanel.toggle()
              // if (art) {
              //   setTimeout(() => {
              //     art.viewport.resizeViewport()
              //   }, 60)
              // }
            }}
          /> */}
        </>
      )}

      {type !== 'art' && isOptionPanelVisible_ && (
        <IconGroupButton
          icon="menu"
          title="配置面板"
          canUse
          canClick
          onClick={() => {
            optionPanel.toggle()
            if (art) {
              setTimeout(() => {
                art.viewport.resizeViewport()
              }, 60)
            }
          }}
        />
      )}
    </div>
  )
}

export default observer(Head)
