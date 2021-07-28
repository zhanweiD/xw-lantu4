/**
 * @author 南风
 * @description 配置项面板
 */
import {types, getEnv} from "mobx-state-tree"

const optionPanelActiveKey = "optionPanelIsActive"
// 项目面板模型
export const MOptionPanel = types
  .model({
    isActive: types.optional(types.boolean, true)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions((self) => ({
    afterCreate() {
      const {session} = self.env_
      self.isActive = session.get(optionPanelActiveKey, self.isActive)
    },

    open() {
      const {session} = self.env_
      self.isActive = true
      session.set(optionPanelActiveKey, true)
    },

    close() {
      const {session} = self.env_
      self.isActive = false
      session.set(optionPanelActiveKey, false)
    },
    toggle() {
      self.isActive ? self.close() : self.open()
    }
  }))
