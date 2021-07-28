import commonAction from "@utils/common-action"
import {flow, getEnv, types} from "mobx-state-tree"
import {MArtThumbnail} from "../art/art-thumbnail"

export const MArtInit = types
  .model({
    projectId: types.number,
    name: types.string,
    width: types.optional(types.union(types.number, types.string), 1920),
    height: types.optional(types.union(types.number, types.string), 1080),

    source: types.optional(types.enumeration(["art", "template"]), "template"),
    templateId: types.maybe(types.union(types.number, types.string)),
    template: types.maybe(MArtThumbnail)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const createBySize = () => {
      const {width, height, name} = self
      if (!name) {
        const {tip} = self.env_
        tip.error({content: "大屏名称不能为空"})
      }
      create({
        width,
        height
      })
    }

    const createByArt = () => {
      const {source, template} = self
      const {artId, width, height} = template
      create({
        source,
        templateId: artId,
        width,
        height
      })
    }

    const resetArtCreateType = () => {
      self.source = "art"
      self.templateId = ""
      self.template = undefined
    }

    const cancelCreate = (id) => {
      const {event} = self.env_
      event.fire("editor.closeTab", id)
    }

    const create = flow(function* create(params) {
      const {io, event} = self.env_
      const {projectId, name} = self

      const art = yield io.art.create({
        ...params,
        name,
        ":projectId": projectId
      })
      event.fire("editor.finishCreate", {type: "art", artId: art.artId, name})
      event.fire("project-panel.createRecentProject", projectId)
    })

    return {
      createBySize,
      createByArt,
      cancelCreate,
      resetArtCreateType
    }
  })
