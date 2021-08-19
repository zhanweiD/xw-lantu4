import {flow, getEnv, getParent, types} from "mobx-state-tree"
import {MZoom} from "@utils/zoom"
import createLog from "@utils/create-log"
import commonAction from "@utils/common-action"

const log = createLog("@models/editor/material.js")

const MMaterialOptions = types.model("MMaterialOptions", {})

export const MMaterialTab = types
  .model("MMaterialTab", {
    id: types.maybe(types.string),
    name: types.maybe(types.string),
    description: types.maybe(types.string),
    path: types.maybe(types.string),
    type: types.maybe(types.string),
    user: types.optional(types.frozen(), {}),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0),
    zoom: types.optional(MZoom, {}),

    mtime: types.maybe(types.frozen()),
    ctime: types.maybe(types.frozen()),
    dtime: types.maybe(types.frozen()),

    materialOptions: types.optional(MMaterialOptions, {})
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get tab_() {
      return getParent(self, 1)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const getMaterialDetail = flow(function* getMaterialDetail() {
      const {io} = self.env_
      try {
        const material = yield io.material.getMaterialDetail({
          ":materialId": self.id
        })
        self.set(material)
      } catch (error) {
        log.error("GetMaterialDetail error: ", error)
      }
    })

    const save = flow(function* save() {
      const {io, tip} = self.env_
      try {
        yield io.material.updateMaterial({
          ":materialId": self.id,
          name: self.name,
          description: self.description
        })
        self.getMaterialDetail()
        tip.success({content: "更新素材详情成功"})
        self.tab_.set({name: self.name})
      } catch (error) {
        log.error("download.Error: ", error)
        tip.error({content: "更新素材详情失败"})
      }
    })

    const initZoom = () => {
      self.zoom.init(document.querySelector(`#material-thumbnail-${self.id}`))
    }

    return {
      save,
      initZoom,
      getMaterialDetail
    }
  })
