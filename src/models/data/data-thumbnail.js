import {flow, getEnv, getRoot, types, getParent} from 'mobx-state-tree'
import createLog from '@utils/create-log'

const log = createLog('@models/data/data-thumbnail')

export const MDataThumbnail = types
  .model({
    dataId: types.number,
    dataName: types.string,
    dataType: types.string,
    folderId: types.number,
    dataSourceId: types.maybeNull(types.number),
    projectId: types.maybeNull(types.number),
    // isCreator: types.boolean,
    // userId: types.number,
    // organizationId: types.optional(types.frozen(), null)
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    get env_() {
      return getEnv(self)
    },
    get isActive_() {
      return getRoot(self).editor.activeTabId === self.dataId
    },
    get dataPanel_() {
      return getParent(self, 3)
    },
  }))
  .actions((self) => {
    const {io, tip, event} = self.env_
    const showDetail = () => {
      const {event} = self.env_
      const {dataId, dataName, folderId, dataType, projectId} = self
      event.fire('editor.openTab', {
        id: dataId,
        name: dataName,
        type: 'data',
        tabOptions: {
          folderId,
          dataType,
          projectId,
        },
      })
    }

    const confirm = (type) => {
      switch (type) {
        case 'removeData': {
          const {dataName} = self
          self.root_.confirm({
            content: `确认删除数据“${dataName}”么？删除后无法恢复！`,
            onConfirm: () => self.removeData(),
            attachTo: false,
          })
          break
        }
        default:
          break
      }
    }

    const removeData = flow(function* removeData() {
      const {dataId, projectId} = self
      try {
        const dataIo = projectId ? io.project.data : io.data
        yield dataIo.removeData({':dataId': dataId, ':projectId': projectId})
        event.fire('dataPanel.getFolders', {type: projectId ? 'project' : 'space'})
        event.fire('editor.closeTab', dataId)
        tip.success({content: '删除数据成功'})
      } catch (error) {
        // TODO error 统一替换
        tip.error({content: '删除数据失败'})
        log.error(error)
      }
    })

    return {
      confirm,
      showDetail,
      removeData,
    }
  })
