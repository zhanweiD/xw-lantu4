// 数据库链接管理 视图层
// TODO overlayManager? Toolbar？
import React, {useEffect} from "react"
import {observer} from "mobx-react-lite"
import Scroll from "@components/scroll"
import Section from "@components/section"
import c from "classnames"
import IconButton from "@components/icon-button"
import {useTranslation} from "react-i18next"
import Overlay from "@components/overlay"
import DataSourceField from "@views/public/data-source-field"
import w from "@models"
import s from "./data-source-manager.module.styl"

const overlayManager = w.overlayManager.get("dataSourceModal")
const Toolbar = ({dataSourceManager}) => {
  const {t} = useTranslation()
  const {keyword, set, searchDatas} = {}

  useEffect(() => {
    dataSourceManager.getDatabaseTypes()
  }, [])
  return (
    <div className={c("fbh fbac cfw2 pl8", s.toolbar)}>
      <div className="fb1 fbh fbac mr8">
        <input
          type="text"
          value={keyword}
          placeholder={t("searchPlaceholder")}
          onChange={(e) => set("keyword", e.target.value)}
          onBlur={() => !keyword && searchDatas()}
          onKeyDown={(e) => e.key === "Enter" && searchDatas()}
        />
      </div>

      {keyword ? (
        <IconButton
          icon="close"
          title={t("remove")}
          onClick={() => {
            set("keyword", "")
            searchDatas()
          }}
        />
      ) : (
        ""
      )}

      <IconButton
        icon="search"
        title={t("search")}
        className="cfw8"
        onClick={searchDatas}
      />
      <IconButton
        icon="create-data"
        className="cfw12"
        title={t("dataPanel.dataCreate")}
        onClick={() => {
          dataSourceManager.applyModalValue()
          overlayManager.show({
            title: "数据库信息",
            content: (
              <DataSourceField
                data={dataSourceManager.modal}
                dataSourceManager={dataSourceManager}
              />
            ),
            attachTo: false
            // top: 500,
            // left: 500,
          })
        }}
      />
    </div>
  )
}

// 现在用处为——数据库链接管理
// TODO 改名
const DataSourceManager = ({dataSourceManager}) => {
  return (
    <Scroll className="h100p">
      <Toolbar dataSourceManager={dataSourceManager} />
      {dataSourceManager.dataSources.map((item, index) => {
        return (
          <Section
            version={3}
            className="pl8 pr8 mt8"
            childrenClassName="pt8"
            name={item.dataSourceName}
            key={index.toString()}
            isFold={false}
            icon={
              <IconButton
                icon="more"
                onClick={(e, button) => {
                  e.stopPropagation()
                  const {dataSourceId} = item
                  const menu = w.overlayManager.get("menu")
                  menu.toggle({
                    attachTo: button,
                    list: [
                      {
                        name: "删除",
                        action: () => {
                          dataSourceManager.removeDataSource({dataSourceId})
                          menu.hide()
                        }
                      }
                    ]
                  })
                }}
              />
            }
          >
            <DataSourceField
              data={item}
              dataSourceManager={dataSourceManager}
            />
          </Section>
        )
      })}
      <Overlay
        model={overlayManager}
        buttons={[
          {
            name: "取消",
            action: () => {
              overlayManager.hide()
            }
          },
          {
            name: "确认",
            action: () => {
              dataSourceManager.createDataSource()
              overlayManager.hide()
            }
          }
        ]}
      />
    </Scroll>
  )
}

export default observer(DataSourceManager)
