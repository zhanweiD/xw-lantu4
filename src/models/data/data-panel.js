import {flow} from 'mobx'
import {types, getEnv, getRoot} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import createLog from '@utils/create-log'
import {MDataToolbar} from './data-toolbar'
import {MDataFolder} from './data-folder'

const log = createLog('@models/data/data-panel')

// const MDataFolders = types
//   .model('MDataFolders', {
//     type: types.string,
//     projectId: types.maybeNull(types.number),
//     folders: types.optional(types.array(MDataFolder), []),
//     folderSort: types.optional(types.array(types.number), []),
//   })
//   .views(self => ({
//     get env_() {
//       return getEnv(self)
//     },
//   }))
//   .actions(commonAction(['set']))
//   .actions(self => {
//     const {io, tip, event} = self.env_
//     const afterCreate = () => {
//       self.getFolders()
//     }

//     // 获取数据文件夹
//     const getFolders = flow(function* getDataFolder() {
//       try {
//         const {list, folderSort} = yield io.data.getDataFolder()
//         self.set({
//           folders: list,
//           folderSort: folderSort,
//         })
//       } catch (error) {
//         // TODO error 统一替换
//         console.log(error)
//       }
//     })

//     return {
//       afterCreate,
//       getFolders
//     }
//   })

export const MDataPanel = types
  .model({
    toolbar: types.optional(MDataToolbar, {}),
    // space: types.optional(MDataFolders, {type: 'space'}),
    // project: types.optional(MDataFolders, {type: 'project'}),
    // 空间数据
    spaceFolders: types.optional(types.array(MDataFolder), []),
    spaceFolderSort: types.optional(types.array(types.number), []),
    // 项目数据
    projectId: types.maybeNull(types.number),
    projectFolders: types.optional(types.array(MDataFolder), []),
    projectFolderSort: types.optional(types.array(types.number), []),
    // 前端使用的属性：创建文件夹弹窗是否展示
    isVisible: types.optional(types.boolean, false),
    // 搜索关键字
    keyword: types.optional(types.string, ''),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get folders_() {
      const basicFolders = []
      const topFolders = []
      self.spaceFolders.forEach((folder) =>
        self.spaceFolderSort.includes(folder.folderId) ? topFolders.push(folder) : basicFolders.push(folder)
      )
      // if (self.keyword) {
      //   topFolders = topFolders.filter((folder) => folder.datas.length || folder.folderName.match(self.keyword))
      // }
      return {
        basicFolders,
        topFolders,
      }
    },
    get hasData_() {
      if (self.spaceFolders.length === 0) {
        return false
      }
      return true
    },
    get datas_() {
      const datas = []
      self.spaceFolders.forEach((dataFolder) => {
        dataFolder.datas.forEach((data) => {
          datas.push(data)
        })
      })
      return datas
    },
    // 获取当前数据面板的类型，分为’project‘数据，‘space’数据和 todo:官方数据
    get dataPanelType_() {
      const {session} = self.env_
      const tabIndex = session.get('tab-data-panel-tab', -1)
      if (tabIndex === 0 && self.projectId) {
        return 'project'
      }
      // if (tabIndex === 1) {
      //   return 'space'
      // }
      return 'space'
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const {io, tip, event} = self.env_
    // model创建好之后进行event的绑定
    const afterCreate = () => {
      event.on('dataPanel.getFolders', self.getFolders)
      event.on('dataPanel.getProjectFolders', self.getProjectFolders)
      event.on('dataPanel.setProjectId', self.setProjectId)
      self.getFolders()
    }

    // 创建数据文件夹
    const createFolder = flow(function* createFolder(name, callback) {
      if (!name) {
        tip.error({content: '文件夹名称不可为空'})
        return
      }
      try {
        if (self.dataPanelType_ === 'project') {
          // const result = yield io.data.createDataFolder({folderName: name})
        } else {
          yield io.data.createDataFolder({folderName: name})
          self.getFolders()
        }

        event.fire('dataPanel.getDataFolder')
        self.set({isVisible: false})
        tip.success({content: `“${name.length > 10 ? name.slice(0, 10) : name}”文件夹新建成功`})
        callback()
      } catch (error) {
        log.error({content: error.message})
        tip.error({content: '文件夹新建失败'})
      }
    })

    // 获取数据文件夹
    const getFolders = flow(function* getDataFolder() {
      try {
        const {list, folderSort} = yield io.data.getDataFolder()
        self.set({
          spaceFolders: list,
          spaceFolderSort: folderSort,
        })
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    // 置顶文件夹
    const toggleFolderTop = flow(function* toggleFolderTop(folder) {
      let isTop
      if (self.dataPanelType_ === 'space') {
        isTop = self.folderSort.includes(folder.folderId)
      }
      if (isTop || self.topFoldersId.includes(folder.folderId)) {
        self.topFoldersId = self.topFoldersId.filter((sortId) => sortId !== folder.folderId)
      } else {
        self.topFoldersId.push(folder.folderId)
      }
      const {tip} = self.env_

      try {
        yield io.user.top({
          ':type': 'data-folder',
          organizationId: self.root_.user.organizationId,
          sortArr: self.topFoldersId,
        })
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
        tip.error({content: error.message})
      }
    })

    // 抽象的确认
    const confirm = (data, type) => {
      switch (type) {
        case 'removeDataFolder': {
          const dataCount = data.datas.length
          if (!dataCount) {
            removeDataFolder(data)
            return
          } else {
            self.root_.confirm({
              content: `“${data.folderName}”下有${dataCount}个数据，您确定要删除吗？`,
              onConfirm: () => removeDataFolder(data),
              attachTo: false,
            })
          }
          break
        }
        default:
          break
      }
    }

    // 删除文件夹
    const removeDataFolder = flow(function* removeDataFolder(folder) {
      const {tip, event} = self.env_
      try {
        yield io.data.removeDataFolder({':folderId': folder.folderId})

        folder.datas.forEach((data) => {
          event.fire('editor.closeTab', data.dataId)
        })

        event.fire('dataPanel.getFolders')
        tip.success({content: '删除文件夹成功'})
      } catch (error) {
        log.error(error)
        tip.error({content: '删除文件夹失败'})
      }
    })

    return {
      afterCreate,
      getFolders,
      createFolder,
      toggleFolderTop,
      confirm,
    }
  })
