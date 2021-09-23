import {flow} from 'mobx'
import {types, getEnv, getRoot, getParent} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import uuid from '@utils/uuid'
import createLog from '@utils/create-log'
import {MDataThumbnail} from './data-thumbnail'

const log = createLog('@models/data/data-folder')

export const MDataFolder = types
  .model('MDataFolder', {
    type: types.string,
    folderId: types.number,
    folderName: types.string,
    dataList: types.optional(types.array(MDataThumbnail), []),
  })
  .views((self) => ({
    get root_() {
      return getRoot(self)
    },
    get env_() {
      return getEnv(self)
    },
    get dataPanel_() {
      return getParent(self, 2)
    },
    get dataList_() {
      const {keyword, projectKeyword} = self.dataPanel_
      const key = self.type === 'project' ? projectKeyword : keyword
      return self.folderName.match(key) ? self.dataList : self.dataList.filter(({dataName}) => dataName.match(key))
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const {io, tip, event} = self.env_

    const createData = ({folderId, dataType}) => {
      const {projectId} = self.dataPanel_
      const type = self.dataPanel_.getDataType()
      let defaultDataName = '未命名数据'
      if (dataType === 'excel') {
        defaultDataName = '新建Excel'
      } else if (dataType === 'json') {
        defaultDataName = '新建JSON'
      } else if (dataType === 'database') {
        defaultDataName = '新建SQL'
      } else if (dataType === 'api') {
        defaultDataName = '新建API'
      }

      event.fire('editor.openTab', {
        id: uuid(),
        name: defaultDataName,
        type: 'data',
        tabOptions: {
          folderId,
          dataType,
          projectId: type === 'project' ? projectId : null,
        },
      })
    }

    const confirm = (data, type) => {
      switch (type) {
        case 'removeData': {
          const {dataName, dataId} = data
          self.root_.confirm({
            content: `确认删除数据“${dataName}”么？删除后无法恢复！`,
            onConfirm: () => removeData({dataId}),
            attachTo: false,
          })
          break
        }
        default:
          break
      }
    }

    const removeData = flow(function* removeData({dataId}) {
      try {
        yield io.data.removeData({':dataId': dataId})
        event.fire('dataPanel.getFolders')
        event.fire('editor.closeTab', dataId)
        tip.success({content: '删除数据成功'})
      } catch (error) {
        // TODO error 统一替换
        tip.error({content: '删除数据失败'})
        log.error(error)
      }
    })

    return {
      createData,
      confirm,
    }
  })
