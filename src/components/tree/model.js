import {types} from "mobx-state-tree"

import {noop, toggleArrayKey} from "./util"

/**
 * 使用tree时，将MTree model传入即可，通过model去管理状态
 */
const MTree = types
  .model("MTree", {
    // 选择的keys
    selectedKeys: types.optional(types.array(types.string), []),
    // 当前展开的keys
    expandedKeys: types.optional(types.array(types.string), []),
    selectExpand: types.optional(types.boolean, false),
    currentActionKey: types.maybeNull(types.string),
    showDetail: types.optional(types.boolean, true),
    defaultExpandAll: types.optional(types.boolean, true)
  })
  .volatile(() => ({
    onSelect: noop,
    onExpand: noop
  }))
  .actions((self) => ({
    afterCreate() {
      console.log("after create....")
    },

    on(eventType, fn) {
      switch (eventType) {
        case "select":
          self.onSelect = fn
          break
        case "expand":
          self.onExpand = fn
          break
        default:
          break
      }
    },
    onSelfSelect(key, selected, nodeInfo) {
      // 目前只考虑单选，即选中后无法取消选中，只能切换
      if (selected) {
        self.selectedKeys = [key]
        self.onSelect(key, selected, nodeInfo)
      }
      if (self.selectExpand) {
        self.onSelfExpand(key, selected, nodeInfo)
      }
    },
    onSelfExpand(key, expanded, nodeInfo) {
      self.expandedKeys = toggleArrayKey(self.expandedKeys, key)
      self.onExpand(key, expanded, nodeInfo)
    },

    expandAll(keys) {
      self.expandedKeys = keys
    },

    setActionKey(key) {
      self.currentActionKey = key
    },

    hiddenAction() {
      self.currentActionKey = null
    }
  }))

export default MTree
