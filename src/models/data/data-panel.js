import {flow} from 'mobx'
import {types, getEnv, getRoot} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import createLog from '@utils/create-log'
// import {MDataToolbar} from './data-toolbar'
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
  .model('MDataPanel', {
    // toolbar: types.optional(MDataToolbar, {}),
    // space: types.optional(MDataFolders, {type: 'space'}),
    // project: types.optional(MDataFolders, {type: 'project'}),
    // 空间数据
    spaceFolders: types.optional(types.array(MDataFolder), []),
    spaceFolderSort: types.optional(types.array(types.number), []),
    // 项目数据
    projectId: types.maybe(types.number),
    projectFolders: types.optional(types.array(MDataFolder), []),
    projectFolderSort: types.optional(types.array(types.number), []),
    // 前端使用的属性：创建文件夹弹窗是否展示
    isVisible: types.optional(types.boolean, false),
    // 搜索关键字
    keyword: types.optional(types.string, ''),
    // 搜索关键字 单独拆出项目的 先快速这么实现，后面和前面的Folders一起优化
    projectKeyword: types.optional(types.string, ''),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get folders_() {
      let topSpaceFolders = self.spaceFolderSort
        .map((id) => self.spaceFolders.find(({folderId}) => folderId === id))
        .filter(Boolean)
      let basicSpaceFolders = self.spaceFolders.filter(({folderId}) => !self.spaceFolderSort.includes(folderId))
      let topProjectFolders = self.projectFolderSort
        .map((id) => self.projectFolders.find(({folderId}) => folderId === id))
        .filter(Boolean)
      let basicProjectFolders = self.projectFolders.filter(({folderId}) => !self.projectFolderSort.includes(folderId))
      if (self.keyword) {
        topSpaceFolders = topSpaceFolders.filter(
          (folder) => folder.dataList_.length || folder.folderName.match(self.keyword)
        )
        basicSpaceFolders = basicSpaceFolders.filter(
          (folder) => folder.dataList_.length || folder.folderName.match(self.keyword)
        )
      }
      if (self.projectKeyword) {
        topProjectFolders = topProjectFolders.filter(
          (folder) => folder.length || folder.folderName.match(self.projectKeyword)
        )
        basicProjectFolders = basicProjectFolders.filter(
          (folder) => folder.dataList_.length || folder.folderName.match(self.projectKeyword)
        )
      }
      return {
        basicSpaceFolders,
        topSpaceFolders,
        basicProjectFolders,
        topProjectFolders,
      }
    },
    // 获取当前数据面板的类型，分为’project‘数据，‘space’数据和 todo:官方数据
    get dataPanelType_() {
      const {session} = self.env_
      const tabIndex = session.get('tab-data-panel-tab', -1)
      console.log('tabIndex', tabIndex)
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
      self.getFolders({type: 'space'})
    }

    // 项目ID变化时更新项目素材
    const setProjectId = ({projectId}) => {
      if (projectId !== self.projectId) {
        self.projectId = projectId
        if (!projectId) {
          self.projectFolders = []
        } else {
          self.getFolders({type: 'project'})
        }
      }
    }

    // 创建数据文件夹
    const createFolder = flow(function* createFolder(name, callback) {
      if (!name) {
        tip.error({content: '文件夹名称不可为空'})
        return
      }
      if (name.length > 32) {
        tip.error({content: '文件夹名称过长'})
        return
      }
      try {
        const dataPanelType = getDataType()

        const dataIo = getDataIo()
        yield dataIo.createDataFolder({folderName: name, ':projectId': self.projectId})
        self.getFolders({type: dataPanelType})
        self.set({isVisible: false})
        tip.success({content: `“${name.length > 10 ? name.slice(0, 10) : name}”文件夹新建成功`})
        callback()
      } catch (error) {
        switch (error.code) {
          case 'ERROR_FOLDER_NAME_EXIST':
            tip.error({content: '文件夹名称已存在'})
            break
          default:
            tip.error({content: '文件夹新建失败'})
        }
        log.error({content: error.message})
      }
    })

    // 获取数据文件夹
    const getFolders = flow(function* getFolders({type}) {
      try {
        if (type === 'project') {
          const {list, folderSort} = yield io.project.data.getDataFolder({':projectId': self.projectId})
          self.set({
            projectFolders: list.map((item) => ({...item, type: 'project'})), //{...list, type: 'project'},
            projectFolderSort: folderSort,
          })
        } else {
          const {list, folderSort} = yield io.data.getDataFolder()
          self.set({
            spaceFolders: list.map((item) => ({...item, type: 'space'})),
            spaceFolderSort: folderSort,
          })
        }
      } catch (error) {
        // TODO error 统一替换
        log.error(error)
      }
    })

    // 置顶文件夹
    const toggleFolderTop = flow(function* toggleFolderTop(folder) {
      let isTop
      const {folderId} = folder
      const dataPanelType = getDataType()
      if (dataPanelType === 'space') {
        isTop = self.spaceFolderSort.includes(folderId)
      }
      if (dataPanelType === 'project') {
        isTop = self.projectFolderSort.includes(folderId)
      }

      try {
        yield io.user.top({
          ':type': 'data-folder',
          action: isTop ? 'cancel' : 'top',
          id: folderId,
          projectId: dataPanelType === 'project' ? self.projectId : undefined,
        })
        isTop ? self.changeFolderSort({folderId, type: 'remove'}) : self.changeFolderSort({folderId, type: 'add'})

        tip.success({content: isTop ? '取消置顶成功' : '置顶成功'})
      } catch (error) {
        log.error('toggleTop Error: ', error)
        tip.error({content: error.message})
      }
    })

    // 改变folderSort
    const changeFolderSort = ({folderId, type}) => {
      const dataPanelType = getDataType()
      if (type === 'remove') {
        dataPanelType === 'space' ? self.spaceFolderSort.remove(folderId) : self.projectFolderSort.remove(folderId)
      } else {
        dataPanelType === 'space' ? self.spaceFolderSort.unshift(folderId) : self.projectFolderSort.unshift(folderId)
      }
    }

    // 抽象的确认
    const confirm = (folder, type) => {
      switch (type) {
        case 'removeFolder': {
          const dataCount = folder.dataList.length
          if (!dataCount) {
            removeFolder(folder)
            return
          } else {
            self.root_.confirm({
              content: `“${folder.folderName}”下有${dataCount}个数据，您确定要删除吗？`,
              onConfirm: () => removeFolder(folder),
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
    const removeFolder = flow(function* removeFolder(folder) {
      const {tip, event} = self.env_
      try {
        const dataPanelType = getDataType()
        const dataIo = getDataIo()
        yield dataIo.removeDataFolder({':folderId': folder.folderId, ':projectId': self.projectId})

        folder.dataList.forEach((data) => {
          event.fire('editor.closeTab', data.dataId)
        })

        event.fire('dataPanel.getFolders', {type: dataPanelType})
        tip.success({content: '删除文件夹成功'})
      } catch (error) {
        log.error(error)
        tip.error({content: '删除文件夹失败'})
      }
    })

    // 获取哪个接口
    const getDataIo = () => {
      const {io} = self.env_
      const dataPanelType = getDataType()
      switch (dataPanelType) {
        case 'project': {
          return io.project.data
        }
        case 'space': {
          return io.data
        }
      }
    }

    // 数据类型
    const getDataType = () => {
      const {session} = self.env_
      const tabIndex = session.get('tab-data-panel-tab', -1)
      if (tabIndex === 0 && self.projectId) {
        return 'project'
      }
      return 'space'
    }

    return {
      afterCreate,
      getFolders,
      createFolder,
      toggleFolderTop,
      confirm,
      changeFolderSort,
      setProjectId,
      getDataType,
    }
  })
