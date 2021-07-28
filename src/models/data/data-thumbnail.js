/**
 * @author 南风
 * @description 数据预览
 */
import {flow, getEnv, getRoot, types} from "mobx-state-tree"

export const MDataThumbnail = types
  .model({
    dataId: types.identifier,
    name: types.string,
    nickname: types.string,
    dataType: types.string,
    isCreator: types.boolean,
    userId: types.number,
    organizationId: types.optional(types.frozen(), null)
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    get env_() {
      return getEnv(self)
    },
    get isActive_() {
      return getRoot(self).editor.activeTabId === self.dataId
    }
  }))
  .actions((self) => {
    const removeConfirm = () => {
      self.root_.confirm({
        content: `确认删除"${self.name}"数据么? 删除之后无法恢复`,
        onConfirm: self.remove
      })
    }

    const remove = flow(function* remove() {
      const {io, event} = self.env_
      try {
        yield io.data.remove({
          ":dataId": self.dataId
        })
        event.fire("dataPanel.getDatas")
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const showDetail = () => {
      const {event} = self.env_
      event.fire("editor.openTab", {
        id: self.dataId,
        name: self.name || "未命名数据",
        type: "data"
      })
    }

    return {
      removeConfirm,
      remove,
      showDetail
    }
  })
