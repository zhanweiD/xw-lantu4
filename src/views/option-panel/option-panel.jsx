import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import s from "./option-panel.module.styl"

const OptionPanel = () => {
  // const {editor, optionPanel} = w

  // const {tabs, activeTabId, isOptionPanelVisible_} = editor

  // const activeTab = tabs.find(tab => tab.id === activeTabId)
  return (
    <div
      className={c("cf2a fbv", s.optionPanel, {
        // hide: !optionPanel.isActive,
      })}
    >
      option-panel
      {/* {
      activeTab.type === 'art' && activeTab.art && <ArtOption art={activeTab.art} />
    }
    {
      activeTab.type === 'materialView' && activeTab.materialThumbnail && <MaterialOption material={activeTab.materialThumbnail} />
    }
    {
      activeTab.type === 'data' && activeTab.data && <DataOption data={activeTab.data} />
    } */}
    </div>
  )
}

export default observer(OptionPanel)
