import commonAction from "@utils/common-action"
import {types, getEnv, flow} from "mobx-state-tree"
import createLog from "@utils/create-log"

const log = createLog("@models/material-panel.js")

const MFolder = types.model("MFolder", {
  folderId: types.number,
  folderName: types.string,
  isTop: types.optional(types.boolean, false),
  materials: types.frozen()
})
export const MMaterialPanel = types
  .model("MMaterialPanel", {
    folders: types.optional(types.array(MFolder), []),
    fetchState: types.optional(types.enumeration(["loading", "success", "error"]), "loading")
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      self.getMaterials()
    }

    const getMaterials = flow(function* getMaterials() {
      const {io} = self.env_
      try {
        const {list, folderSort} = yield io.material.getMaterials()
        const folders = list.map((folder) => ({
          ...folder,
          isTop: folderSort.includes(folder.folderId)
        }))
        self.set({
          folders,
          fetchState: "success"
        })
      } catch (error) {
        log.error("getMaterials Error: ", error)
      }
    })

    return {
      afterCreate,
      getMaterials
    }
  })
