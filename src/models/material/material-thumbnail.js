import {getRoot, types, flow} from "mobx-state-tree"
import createLog from "@utils/create-log"
import copy from "@utils/copy"

const log = createLog("@models/material-thumbnail.js")
export const MMaterial = types
  .model(" MMaterial", {
    folderId: types.number,
    materialId: types.string,
    type: types.string,
    name: types.optional(types.string, ""),
    ctime: types.number
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    }
  }))
  .actions((self) => {
    const remove = () => {
      self.root_.confirm({
        content: `确认删除素材“${self.name}”么？删除后无法恢复！`,
        attachTo: false,
        onConfirm: removeMaterial
      })
    }

    const showDetail = () => {
      const {event} = self.env_
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
      const {io, event} = self.env_
      try {
        yield io.material.removeMaterial({
          ":materialId": self.materialId
        })
        event.fire("editor.closeTab", self.materialId)
        event.fire("materialPanel.getMaterials")
      } catch (error) {
        log.error("remove Error: ", error)
      }
    })

    const copyId = () => {
      copy(self.materialId)
    }

    return {
      showDetail,
      remove,
      copyId
    }
  })
