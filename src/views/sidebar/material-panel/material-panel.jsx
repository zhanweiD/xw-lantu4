import React from "react"
import {observer} from "mobx-react-lite"
import {useTranslation} from "react-i18next"
import Tab from "@components/tab"
import Icon from "@components/icon"
import Loading from "@components/loading"
import w from "@models"

const MaterialPanel = () => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {materialPanel} = sidebar
  const {fetchState} = materialPanel
  return (
    <Loading data={fetchState}>
      <Tab sessionId="material-panel-tab" className="w100p">
        <Tab.Item name={t("materialPanel.materials")}>
          {/* {
            folders.length ? 
          } */}
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
