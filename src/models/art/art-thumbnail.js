import commonAction from '@utils/common-action'
import config from '@utils/config'
import {types, getEnv, flow, getRoot} from 'mobx-state-tree'
import createLog from '@utils/create-log'

const log = createLog('@models/art/art-thumbnail.js')

export const MArtThumbnail = types
  .model({
    name: types.string,
    artId: types.number,
    projectId: types.number,
    publishId: types.string,
    thumbnail: types.maybeNull(types.string),
    isOnline: types.optional(types.boolean, false),
    isTemplate: types.optional(types.boolean, false),
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
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    // 预览数据屏
    const previewArt = () => {
      window.open(`${window.location.origin}${config.pathPrefix}/preview/${self.artId}`, 'previewWindow')
    }

    // 预览发布的数据屏
    const previewPublishArt = () => {
      window.open(`${window.location.origin}${config.pathPrefix}/publish/${self.publishId}`, 'previewWindow')
    }

    // 保存为模板
    const saveAsTemplate = flow(function* saveAsTemplate() {
      const {env_, artId} = self
      const {io, tip, event} = env_
      try {
        yield io.art.saveAsTemplate({
          ':artId': artId,
        })
        event.fire('project-panel.getTemplates')
        tip.success({content: '保存为模板成功'})
      } catch (error) {
        log.error(error)
        tip.error({content: error.message})
      }
    })

    // 复制数据屏
    const copyArt = flow(function* copyArt() {
      const {env_, projectId, artId} = self
      const {io, tip, event} = env_
      try {
        yield io.art.copy({
          ':projectId': projectId,
          ':artId': artId,
        })
        event.fire('project-panel.getProjects')
        tip.success({content: '复制数据屏成功'})
      } catch (error) {
        log.error(error)
        tip.error({content: error.message})
      }
    })

    // 导出数据屏
    const exportArt = () => {
      const {tip} = self.env_
      const a = document.createElement('a')
      const e = document.createEvent('MouseEvents')
      a.href = `api/v4/waveview/export/art/${self.artId}`
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
      tip.success({content: '导出数据屏成功'})
    }

    // 编辑数据屏
    const editArt = () => {
      const {event} = self.env_
      event.fire('project-panel.createRecentProject', self.projectId)
      event.fire('editor.openTab', {
        type: 'art',
        id: self.artId,
        name: self.name,
        tabOptions: {
          projectId: self.projectId,
        },
      })
    }

    // 删除数据屏，提示动作
    const removeArt = () => {
      self.root_.confirm({
        content: `确认删除"${self.name}"${self.isTemplate ? '模板' : '数据屏'}么? 删除之后无法恢复`,
        onConfirm: self.reallyRemoveArt,
        attachTo: false,
      })
    }

    // 删除数据屏，删除动作
    const reallyRemoveArt = flow(function* removeArt() {
      const {io, event, tip} = self.env_
      const {projectId, artId} = self
      try {
        if (self.isTemplate) {
          yield io.project.removeTemplate({':templateId': artId, source: 'art'})
        } else {
          yield io.art.remove({':projectId': projectId, ':artId': artId})
        }
        event.fire(self.isTemplate ? 'project-panel.getTemplates' : 'project-panel.getProjects')
        event.fire('editor.closeTab', self.artId)
        tip.success({content: '删除成功'})
      } catch (error) {
        log.error(error)
        tip.error({content: '删除失败'})
      }
    })

    // 更新缩略图
    const updateThumbnail = flow(function* () {
      const {io, tip, event} = self.env_
      try {
        yield io.art.getThumbnail({':artId': self.artId})
        event.fire(self.isTemplate ? 'project-panel.getTemplates' : 'project-panel.getProjects')
      } catch (error) {
        tip.error({content: error.message})
      }
    })

    return {
      editArt,
      copyArt,
      exportArt,
      removeArt,
      reallyRemoveArt,
      previewArt,
      previewPublishArt,
      saveAsTemplate,
      updateThumbnail,
    }
  })
