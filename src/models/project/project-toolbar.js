import commonAction from "@utils/common-action"
import {getEnv, flow, getRoot, types, getParent} from "mobx-state-tree"
import createLog from "@utils/create-log"

const log = createLog("@models/project/project-list.js")

export const MProjectToolbar = types
  .model({
    keyword: types.optional(types.string, ""),
    isThumbnailVisible: types.optional(types.boolean, true),
    isCreateModalVisible: types.optional(types.boolean, false)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get projectPanel_() {
      return getParent(self, 1)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    // 切换展示方式
    const toggleDisplay = () => {
      self.isThumbnailVisible = !self.isThumbnailVisible
      self.projectPanel_.saveLocal()
    }

    // 创建新的项目
    const createProject = flow(function* createProject({name, description}) {
      const {io, event, tip} = self.env_
      try {
        const project = yield io.project.create({name, description})
        event.fire("editor.finishCreate", {type: "project"})
        event.fire("project-panel.setNewCreateProjectId", project.projectId)
        event.fire("project-panel.getProjects")
        tip.success({content: "新建项目成功"})
      } catch (error) {
        log.error(error)
        tip.error({content: `新建项目失败：${error.message}`})
      }
    })

    return {
      toggleDisplay,
      createProject
    }
  })
