import copy from "@utils/copy"
import createLog from "@utils/create-log"
import {flow, getEnv, getParent, getRoot, types} from "mobx-state-tree"

const log = createLog("@models/material-thumbnail.js")
export const MMaterial = types
  .model(" MMaterial", {
    folderId: types.number,
    materialId: types.string,
    type: types.optional(types.enumeration(["GeoJSON", "image"]), "image"),
    name: types.optional(types.string, ""),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0)
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    get env_() {
      return getEnv(self)
    },
    get isActive_() {
      return getRoot(self).editor.activeTabId === self.materialId
    },
    get materialPanel_() {
      return getParent(self, 4)
    }
  }))
  .actions((self) => {
    const {event, io, tip, session} = self.env_
    const remove = () => {
      self.root_.confirm({
        content: `确认删除素材“${self.name}”么？删除后无法恢复！`,
        attachTo: false,
        onConfirm: self.removeMaterial
      })
    }

    const showDetail = () => {
      event.fire("editor.openTab", {
        id: self.materialId,
        name: self.name,
        type: "material",
        tabOptions: {
          folderId: self.folderId,
          materialType: self.type
        }
      })
    }

    const removeMaterial = flow(function* remove() {
      const tabIndex = session.get("tab-material-panel-tab", -1)
      const {projectId} = self.materialPanel_
      try {
        if (tabIndex === 0 && projectId) {
          yield io.material.removeProjectMaterial({":projectId": projectId, ":materialId": self.materialId})
          event.fire("materialPanel.getProjectFolders")
        } else if (tabIndex === 1) {
          yield io.material.removeMaterial({":materialId": self.materialId})
          event.fire("materialPanel.getFolders")
        } else {
          throw new Error("当前无关联的数据屏")
        }
        event.fire("editor.closeTab", self.materialId)
      } catch (error) {
        log.error("remove Error: ", error)
        tip.error({content: "删除失败"})
      }
    })

    const copyId = () => {
      copy(self.materialId)
      tip.success({content: "复制成功"})
    }

    return {
      showDetail,
      remove,
      removeMaterial,
      copyId
    }
  })
