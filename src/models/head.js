import commonAction from "@utils/common-action"
import {types, getEnv} from "mobx-state-tree"

// 没有激活的面板按钮
const NO_ACTIVE_PANEL_BUTTON = "NO_ACTIVE_PANEL_BUTTON"

export const MHead = types
  .model("MHead", {
    activePanelButton: types.optional(
      types.enumeration([
        NO_ACTIVE_PANEL_BUTTON,
        "projects",
        "exhibits",
        "datas",
        "materials"
      ]),
      NO_ACTIVE_PANEL_BUTTON
    ),
    panelButtons: types.frozen(["projects", "exhibits", "datas", "materials"])
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      event.on("head.toggleActivePanel", (panel) => {
        self.toggleActivePanel(panel)
      })
    }
    const toggleActivePanel = (panel) => {
      const {activePanelButton} = self
      const {session} = self.env_
      if (panel === activePanelButton) {
        panel = NO_ACTIVE_PANEL_BUTTON
      }
      // event.fire("sidebar.toggleActivePanel", panel)
      session.set("activePanel", panel)
      self.activePanelButton = panel
    }
    return {
      afterCreate,
      toggleActivePanel
    }
  })
