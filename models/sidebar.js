import {types, getEnv} from 'mobx-state-tree'
import {MProjectPanel} from './project/project-panel'
import {MMaterialPanel} from './material/material-panel'
import {MDataPanel} from './data/data-panel'
import {MExhibitPanel} from './exhibit/exhibit-panel'

const NO_ACTIVE_PANEL = 'NO_ACTIVE_PANEL'

export const MSidebar = types
  .model({
    activePanel: types.optional(
      types.enumeration([NO_ACTIVE_PANEL, 'projects', 'exhibits', 'datas', 'materials']),
      NO_ACTIVE_PANEL
    ),
    panels: types.frozen(['projects', 'exhibits', 'datas', 'materials']),
    projectPanel: types.optional(MProjectPanel, {}),
    exhibitPanel: types.optional(MExhibitPanel, {}),
    materialPanel: types.optional(MMaterialPanel, {}),
    dataPanel: types.optional(MDataPanel, {}),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      event.on('sidebar.toggleActivePanel', (panel) => {
        self.toggleActivePanel(panel)
      })
    }

    const toggleActivePanel = (panel) => {
      if (self.panels.includes(panel)) {
        self.activePanel = panel
      } else {
        self.activePanel = NO_ACTIVE_PANEL
      }
    }
    return {
      afterCreate,
      toggleActivePanel,
    }
  })
