/**
 * @author 南风
 * @description 项目详情tab
 */
import commonAction from "@utils/common-action"
import {flow, getEnv, getParent, getRoot, types} from "mobx-state-tree"
import moment from "moment"

export const MArtDetail = types
  .model({
    projectId: types.optional(types.number, 0),
    artId: types.optional(types.number, 0),
    name: types.optional(types.string, ""),
    user: types.optional(types.frozen(), {}),
    ctime: types.optional(types.string, ""),
    mtime: types.optional(types.string, ""),
    remark: types.optional(types.string, ""),
    width: types.optional(types.number, 0),
    height: types.optional(types.number, 0)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get tab_() {
      return getParent(self, 1)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const update = flow(function* update() {
      const {io, event} = self.env_
      const {projectId, artId, name, remark} = self
      try {
        yield io.art.update({
          ":projectId": projectId,
          ":artId": artId,
          name,
          remark
        })
        event.fire("editor.finishUpdate", {
          type: "art"
        })
        event.fire("project-panel.getProjects")
        self.tab_.set({name: self.name})
      } catch (error) {
        // TODO: 统一替换
        console.log("error")
      }
    })

    const getDetail = flow(function* remove() {
      try {
        const {io} = self.env_
        const art = yield io.art.getDetail({
          ":artId": self.artId,
          hasBoxes: true
        })
        art.ctime = moment(art.ctime).format("YYYY-MM-DD HH:mm:ss")
        art.mtime = moment(art.mtime).format("YYYY-MM-DD HH:mm:ss")
        art.width = art.frames[0].layout.width
        art.height = art.frames[0].layout.height
        self.set(art)
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    return {
      update,
      getDetail
    }
  })
