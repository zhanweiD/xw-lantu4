import React, {Children} from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import c from "classnames"
import w from "@models"
import IconGroupButton from "@components/icon-group-button"
import Button from "@components/button"
import {Link} from "react-router-dom"
import config from "@utils/config"
import copy from "@utils/copy"
import {HeadDropMenu} from "./head-drop-menu"
import s from "./head.module.styl"
import PanelButton from "./panel-button"

const Head = ({showTabs = true}) => {
  const {t} = useTranslation()
  const {head, user, editor, env_, optionPanel} = w
  const {panelButtons, activePanelButton} = head
  const {activeTabId, tabs, isOptionPanelVisible_} = editor
  const activeTab = tabs.filter((tab) => tab.id === activeTabId)[0] || {}
  const {type, art, data, materialThumbnail, save} = activeTab
  const {viewport} = art || {}
  const {selectRange, isGridVisible, isBoxBackgroundVisible, isSnap} =
    viewport || {}
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
    <div className={c("cf3 fbh fbac", s.head)}>
      <div className={c("fb1 fbh fbac")}>
        <div>
          <Link to="/" className={c(s.logo, "fbh fbac fbjc")}>
            <img src={config.logo} alt="logo" />
          </Link>
        </div>

        {showTabs && (
          <>
            {panelButtons.map((panel) =>
              Children.toArray(
                <PanelButton
                  name={t(panel)}
                  active={activePanelButton === panel}
                  onClick={() => {
                    head.toggleActivePanel(panel)
                  }}
                />
              )
            )}
          </>
        )}
      </div>

      {showTabs && type === "art" && (
        <>
          <IconGroupButton
            icon="lodestone"
            title="开启吸附"
            canUse={isSnap}
            canClick
            onClick={() => {
              viewport.set("isSnap", !isSnap)
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
              selectRange.updateAverage("horizontal")
            }}
            layout="start"
          />

          <IconGroupButton
            icon="vertical-equalization"
            title="垂直均分"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAverage("vertical")
            }}
            layout="end"
          />

          <IconGroupButton
            icon="space-horizontally"
            title="水平间隔"
            canUse={size > 2}
            canClick={size > 2}
            onClick={() => {
              selectRange.updateSpace("horizontal")
            }}
            layout="start"
          />

          <IconGroupButton
            icon="space-vertically"
            title="垂直间隔"
            canUse={size > 2}
            canClick={size > 2}
            onClick={() => {
              selectRange.updateSpace("vertical")
            }}
            layout="end"
          />
          <IconGroupButton
            icon="left-align"
            title="左对齐"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign("left")
            }}
            layout="start"
          />
          <IconGroupButton
            icon="center-horizontally-align"
            title="水平居中"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign("center")
            }}
            layout="center"
          />
          <IconGroupButton
            icon="right-align"
            title="右对齐"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign("right")
            }}
            layout="center"
          />
          <IconGroupButton
            icon="top-align"
            title="顶对齐"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign("top")
            }}
            layout="center"
          />
          <IconGroupButton
            icon="center-vertical-align"
            title="垂直居中"
            canUse={size > 1}
            onClick={() => {
              selectRange.updateAlign("middle")
            }}
            layout="center"
          />
          <IconGroupButton
            icon="bottom-align"
            title="底对齐"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign("bottom")
            }}
            layout="end"
          />
          <IconGroupButton
            icon="grid"
            title="显示/隐藏网格"
            canUse={isGridVisible}
            canClick
            onClick={() => {
              viewport.set("isGridVisible", !isGridVisible)
            }}
            layout="start"
          />
          <IconGroupButton
            icon="container"
            title="显示/隐藏容器"
            canUse={isBoxBackgroundVisible}
            canClick
            onClick={() => {
              viewport.set("isBoxBackgroundVisible", !isBoxBackgroundVisible)
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
                isArtPublishInfoVisible: true
              })
            }}
            layout="end"
          />
        </>
      )}
      {showTabs && type === "data" && (
        <>
          {/* <IconGroupButton
            icon="undo"
            title="撤销"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign('left')
            }}
            layout="start" />
          <IconGroupButton
            icon="redo"
            title="重做"
            canUse={size > 1}
            canClick={size > 1}
            onClick={() => {
              selectRange.updateAlign('bottom')
            }}
            layout="end" /> */}
          <IconGroupButton
            icon="reset"
            title="刷新"
            canUse
            canClick
            onClick={data.getData}
          />
          <Button
            width={70}
            lineHeight={22}
            className="ml8"
            onClick={() => {
              copy(data.dataId)
              env_.tip.success({content: "复制成功"})
            }}
          >
            复制ID
          </Button>
        </>
      )}
      {showTabs && type === "materialView" && (
        <>
          <Button
            width={70}
            lineHeight={22}
            className="ml8"
            onClick={() => {
              copy(materialThumbnail.id)
              env_.tip.success({content: "复制成功"})
            }}
          >
            复制ID
          </Button>
        </>
      )}

      {showTabs && ["materialView", "data", "art"].includes(type) && (
        <>
          <Button
            width={70}
            lineHeight={22}
            className="ml8"
            type="primary"
            onClick={save}
          >
            保存
          </Button>
        </>
      )}

      {showTabs && isOptionPanelVisible_ && (
        <IconGroupButton
          icon="menu"
          title="显示隐藏配置项面板"
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

      {showTabs && <HeadDropMenu user={user} />}
    </div>
  )
}

export default observer(Head)
