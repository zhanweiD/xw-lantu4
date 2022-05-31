/*
 * @Author: 柿子
 * @Date: 2021-07-28 13:40:30
 * @LastEditTime: 2021-07-29 16:59:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/head.js
 */
import commonAction from '@utils/common-action'
import {types, getEnv} from 'mobx-state-tree'

// 没有激活的面板按钮
const NO_ACTIVE_PANEL = 'NO_ACTIVE_PANEL'

export const MHead = types
  .model('MHead', {
    activePanelButton: types.optional(
      types.enumeration([NO_ACTIVE_PANEL, 'projects', 'exhibits', 'datas', 'materials']),
      'projects'
    ),
    panelButtons: types.frozen(['projects', 'exhibits', 'datas', 'materials']),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      event.on('head.toggleActivePanel', (panel) => {
        self.toggleActivePanel(panel)
      })
    }
    const toggleActivePanel = (panel) => {
      const {activePanelButton} = self
      const {session, event} = self.env_
      if (panel === activePanelButton) {
        panel = NO_ACTIVE_PANEL
      }
      event.fire('sidebar.toggleActivePanel', panel)
      session.set('activePanel', panel)
      self.activePanelButton = panel
    }
    return {
      afterCreate,
      toggleActivePanel,
    }
  })
