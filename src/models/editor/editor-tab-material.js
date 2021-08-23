import {flow, getEnv, types} from "mobx-state-tree"
import {MZoom} from "@utils/zoom"
import createLog from "@utils/create-log"
import commonAction from "@utils/common-action"

const log = createLog("@models/editor/material.js")

export const MMaterial = types
  .model("MMaterial", {
    materialId: types.string,
    name: types.optional(types.string, "未命名素材"),
    description: types.optional(types.string, ""),
    type: types.optional(types.enumeration(["GeoJSON", "image"]), "image"),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
    zoom: types.optional(MZoom, {}),
    ctime: types.maybe(types.number),
    path: types.optional(types.string, ""),
    user: types.frozen(),
    fetchState: types.optional(types.enumeration("MMaterialTab.fetchState", ["loading", "success", "error"]), "loading")
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const getMaterialDetail = flow(function* getMaterialDetail() {
      const {io} = self.env_
      self.fetchState = "loading"
      try {
        const material = yield io.material.getMaterialDetail({
          ":materialId": self.materialId
        })
        self.set(material)
        self.fetchState = "success"
      } catch (error) {
        self.fetchState = "error"
        log.error("getMaterialDetail Error: ", error)
      }
    })
    const save = flow(function* save() {
      const {io, tip, event} = self.env_
      try {
        yield io.material.updateMaterial({
          ":materialId": self.materialId,
          name: self.name,
          description: self.description
        })
        tip.success({content: "更新素材详情成功"})
        event.fire("editor.updateTabname", {name: self.name, id: self.materialId})
      } catch (error) {
        log.error("download.Error: ", error)
        tip.error({content: "更新素材详情失败"})
      }
    })

    const initZoom = () => {
      self.isInit = true
      self.zoom.init(document.querySelector(`#material-${self.materialId}`))
    }

    return {
      getMaterialDetail,
      save,
      initZoom
    }
  })
