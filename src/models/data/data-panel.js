import {flow} from 'mobx'
import {types, getEnv, getRoot, applySnapshot} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import uuid from '@utils/uuid'
// import {createConfigModelClass} from '@components/field'
import createLog from '@utils/create-log'
// import io from '@utils/io'
import {MDataToolbar} from './data-toolbar'
import {MDataTab} from '../editor/editor-tab-data'

const log = createLog('@models/data/data-panel')

const MDataFolder = types
  .model('MDataFolder', {
    folderId: types.number,
    folderName: types.string,
    datas: types.optional(types.array(MDataTab), []),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get datas_() {
      return self.datas
    },
  }))

export const MDataPanel = types
  .model({
    toolbar: types.optional(MDataToolbar, {}),
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
      // self.getFolders()
      self.getFolders()
    }
    // 新建文件夹的 Model 框
    // const createFolderConfirm = () => {
    //   const modal = self.root_.overlayManager.get('fieldModal')
    //   const MDataCreaterFolder = createConfigModelClass('MDataCreaterFolder', {
    //     sections: ['__hide__'],
    //     fields: [
    //       {
    //         section: '__hide__',
    //         option: 'name',
    //         field: {
    //           type: 'text',
    //           label: 'name',
    //           placeholder: '文件夹名称不能为空、重复',
    //           defaultValue: '',
    //         },
    //       },
    //     ],
    //   })
    //   modal.show({
    //     attachTo: false,
    //     title: '新建文件夹',
    //     height: 160,
    //     content: MDataCreaterFolder.create(),
    //     buttons: [
    //       {
    //         name: '取消',
    //         action: () => {
    //           modal.hide()
    //         },
    //       },
    //       {
    //         name: '确定',
    //         action: (schema) => {
    //           self.createDataFolder(schema)
    //         },
    //       },
    //     ],
    //   })
    // }

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
        // event.once('overlay.fieldModal.onConfirm', self.createDataFolder)
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

    const openTabByData = ({folder, data, type}) => {
      const {event} = self.env_
      let defaultDataName = '未命名数据'
      if (type === 'excel') {
        defaultDataName = '新建Excel'
      } else if (type === 'json') {
        defaultDataName = '新建JSON'
      } else if (type === 'database') {
        defaultDataName = '新建SQL'
      } else if (type === 'api') {
        defaultDataName = '新建API'
      }

      event.fire('editor.openTab', {
        id: data ? data.dataId : uuid(),
        name: data?.dataName || defaultDataName,
        type: 'data',
        tabOptions: {
          folderId: folder.folderId,
          dataType: type,
        },
      })
    }

    // const afterCreate = () => {
    //   const {event} = self.env_
    //   self.getDataFolder()

    //   event && event.on('dataPanel.getDataFolder', self.getDataFolder)
    // }

    const applyLocal = () => {
      const {local} = self.env_
      const localSchema = local.get('SKMaterialPanel')
      localSchema && applySnapshot(self, localSchema)
    }

    const saveLocal = () => {
      const {local} = self.env_
      local.set('SKMaterialPanel', {
        toolbar: self.toolbar.toJSON(),
      })
    }

    // 置顶文件夹
    const stickyFolder = flow(function* stickyFolder(folder, isTop) {
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

    // 确认删除文件夹
    const confirmDeleteFolder = (folder) => {
      const dataCount = folder.datas.length
      if (!dataCount) {
        self.removeDataFolder(folder)
      } else {
        self.root_.confirm({
          content: `“${folder.folderName}”下有${dataCount}个数据，您确定要删除吗？`,
          onConfirm: () => self.removeDataFolder(folder),
          attachTo: false,
        })
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

        event.fire('dataPanel.getDataFolder')
        tip.success({content: '删除文件夹成功'})
      } catch (error) {
        log.error(error)
        tip.error({content: '删除文件夹失败'})
      }
    })

    // 确认删除数据
    const confirmDeleteData = (data) => {
      const {dataName, dataId} = data
      self.root_.confirm({
        content: `确认删除数据“${dataName}”么？删除后无法恢复！`,
        onConfirm: () => self.removeData({dataId}),
        attachTo: false,
      })
    }

    const removeData = flow(function* removeData({dataId}) {
      const {event} = self.env_
      try {
        yield io.data.removeData({':dataId': dataId})
        event.fire('dataPanel.getDataFolder')
        event.fire('editor.closeTab', dataId)
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    return {
      afterCreate,
      // getDataFolder,
      getFolders,
      applyLocal,
      saveLocal,
      openTabByData,
      createFolder,
      // createFolderConfirm,
      stickyFolder,
      removeDataFolder,
      confirmDeleteData,
      removeData,
      confirmDeleteFolder,
    }
  })
