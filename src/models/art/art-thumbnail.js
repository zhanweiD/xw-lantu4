/**
 * @author 南风
 * @description 大屏详情
 */
import commonAction from "@utils/common-action"
import config from "@utils/config"
import uuid from "@utils/uuid"
import {types, getEnv, flow, getRoot} from "mobx-state-tree"

export const MArtThumbnail = types
  .model({
    artId: types.number,
    name: types.string,
    thumbnail: types.maybeNull(types.string),
    isOnline: types.boolean,
    projectId: types.number,
    publishId: types.string
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get isActive_() {
      return getRoot(self).editor.activeTabId === self.artId
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const previewArt = () => {
      window.open(
        `${window.location.origin}${config.pathPrefix}/preview/${self.artId}`,
        "previewWindow"
      )
    }

    const previewPublishArt = () => {
      window.open(
        `${window.location.origin}${config.pathPrefix}/publish/${self.publishId}`,
        "previewWindow"
      )
    }

    const saveAsTemplate = () => {
      console.log("save as template")
    }

    const copyArt = flow(function* copyArt() {
      const {env_, projectId, artId} = self
      const {io, tip, event} = env_
      try {
        yield io.art.copy({
          ":projectId": projectId,
          ":artId": artId
        })
        tip.success({content: "复制大屏成功"})
        event.fire("project-panel.getProjects")
      } catch (error) {
        tip.error({content: error.message})
      }
    })

    const exportArt = () => {
      const {tip} = self.env_
      const a = document.createElement("a")
      a.href = `api/v4/waveview/export/art/${self.artId}`
      const e = document.createEvent("MouseEvents")
      e.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      a.dispatchEvent(e)
      tip.success({content: "导出大屏成功"})
    }

    const showDetail = () => {
      const {event} = self.env_
      event.fire("editor.openTab", {
        id: self.artId,
        name: self.name,
        type: "art"
      })
      event.fire("project-panel.createRecentProject", self.projectId)
    }

    const updateArt = () => {
      const {event} = self.env_
      const {name, projectId, artId} = self
      event.fire("editor.openTab", {
        type: "artDetail",
        name,
        id: uuid(),
        tabOptions: {
          name,
          projectId,
          artId
        }
      })
    }

    const remove = () => {
      self.root_.confirm({
        content: `确认删除"${self.name}"数据屏么? 删除之后无法恢复`,
        onConfirm: self.removeArt,
        attachTo: false
      })
    }

    const removeArt = flow(function* removeArt() {
      const {io, event, tip} = self.env_
      const {projectId, artId} = self
      try {
        yield io.art.remove({
          ":projectId": projectId,
          ":artId": artId
        })
        event.fire("project-panel.getProjects")
        event.fire("editor.closeTab", self.artId)
        tip.success({content: "删除成功"})
      } catch (error) {
        // TODO error 统一替换
        console.error(error)
        tip.error({content: "删除失败"})
      }
    })

    return {
      copyArt,
      saveAsTemplate,
      showDetail,
      removeArt,
      remove,
      updateArt,
      previewArt,
      previewPublishArt,
      exportArt
    }
  })
