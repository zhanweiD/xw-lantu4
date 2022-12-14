import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import w from '@models'
import ArtOption from './art-option'
import MaterialOption from './material-option'
import DataOption from './data-option'
import s from './option-panel.module.styl'

const OptionPanel = () => {
  const {editor, optionPanel} = w

  const {tabs, activeTabId, isOptionPanelVisible_} = editor

  const activeTab = tabs.find((tab) => tab.id === activeTabId)
  return isOptionPanelVisible_ ? (
    <div
      className={c('cf2a fbv fbn pr', s.optionPanel, {
        hide: !optionPanel.isActive,
      })}
    >
      {activeTab.type === 'art' && activeTab.art && <ArtOption art={activeTab.art} />}
      {activeTab.type === 'material' && activeTab.material && <MaterialOption material={activeTab.material} />}
      {activeTab.type === 'data' && activeTab.data && <DataOption data={activeTab.data} />}
    </div>
  ) : null
}

export default observer(OptionPanel)
