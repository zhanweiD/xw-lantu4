/**
 * @author 南风
 * @description 数据面板
 */
import {flow} from "mobx"
import {types, getEnv, getRoot, applySnapshot} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import uuid from "@utils/uuid"
import {createConfigModelClass} from "@components/field"
import createLog from "@utils/create-log"
import io from "@utils/io"
import {MDataToolbar} from "./data-toolbar"
import {MDataTab} from "../editor/editor-tab-data"

const log = createLog("@models/data/data-panel")
const MDataFolder = types
  .model("MDataFolder", {
    folderId: types.number,
    folderName: types.string,
    datas: types.optional(types.array(MDataTab), [])
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get datas_() {
      return self.datas
    }
  }))

export const MDataPanel = types
  .model({
    name: "dataPanel",
    toolbar: types.optional(MDataToolbar, {}),
    folders: types.optional(types.array(MDataFolder), []),
    topFoldersId: types.optional(types.array(types.number), [])
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
      self.folders.forEach((folder) => {
        if (self.topFoldersId.includes(folder.folderId)) {
          topFolders.push(folder)
        } else {
          basicFolders.push(folder)
        }
      })

      return {
        basicFolders,
        topFolders
      }
    },
    get hasData_() {
      if (self.folders.length === 0) {
        return false
      }
      return true
    },
    get datas_() {
      const datas = []
      self.folders.forEach((dataFolder) => {
        dataFolder.datas.forEach((data) => {
          datas.push(data)
        })
      })
      return datas
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    // 新建文件夹的 Model 框
    const createFolderConfirm = () => {
      const modal = self.root_.overlayManager.get("fieldModal")
      const MDataCreaterFolder = createConfigModelClass("MDataCreaterFolder", {
        sections: ["__hide__"],
        fields: [
          {
            section: "__hide__",
            option: "name",
            field: {
              type: "text",
              label: "name",
              placeholder: "文件夹名称不能为空、重复",
              defaultValue: ""
            }
          }
        ]
      })
      modal.show({
        attachTo: false,
        title: "新建文件夹",
        height: 160,
        content: MDataCreaterFolder.create(),
        buttons: [
          {
            name: "取消",
            action: () => {
              modal.hide()
            }
          },
          {
            name: "确定",
            action: (schema) => {
              self.createDataFolder(schema)
            }
          }
        ]
      })
    }

    const createDataFolder = flow(function* createDataFolder({name}) {
      // console.log(name)
      const modal = self.root_.overlayManager.get("fieldModal")
      const {event, tip} = self.env_
      try {
        const result = yield io.data.createDataFolder({folderName: name})
        event.fire("dataPanel.getDataFolder")
        tip.success({content: `"${name}"文件夹新建成功`})
        modal.hide()

        if (result.folderId) {
          self.set({
            folders: [
              {
                folderId: result.folderId,
                folderName: result.folderName,
                data: []
              }
            ].concat(self.folders)
          })
        }
      } catch (error) {
        log.error({content: error.message})
        tip.error({content: "文件夹新建失败"})
        // event.once('overlay.fieldModal.onConfirm', self.createDataFolder)
      }
    })

    // 获取数据文件夹
    const getDataFolder = flow(function* getDataFolder() {
      try {
        const {list, folderSort} = yield io.data.getDataFolder()
        // const dataList = list.map(folder => {
        //   return {
        //     folderId: folder.folderId,
        //     folderName: folder.folderName,
        //     datas: folder.datas.map(data => {
        //       return {
        //         dataName: data.dataName,
        //         type: data.dataType,
        //         dataId: data.dataId,
        //         folderId: data.folderId,
        //       }
        //     }),
        //   }
        // })
        self.set({
          folders: list,
          topFoldersId: folderSort
        })
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const openTabByData = ({folder, data, type}) => {
      const {event} = self.env_
      let defaultDataName = "未命名数据"
      if (type === "excel") {
        defaultDataName = "新建Excel"
      } else if (type === "json") {
        defaultDataName = "新建JSON"
      } else if (type === "database") {
        defaultDataName = "新建SQL"
      } else if (type === "api") {
        defaultDataName = "新建API"
      }

      event.fire("editor.openTab", {
        id: data ? data.dataId : uuid(),
        name: data?.dataName || defaultDataName,
        type: "data",
        tabOptions: {
          folderId: folder.folderId,
          dataType: type
        }
      })
    }

    const afterCreate = () => {
      const {event} = self.env_
      self.getDataFolder()

      event && event.on("dataPanel.getDataFolder", self.getDataFolder)
    }

    const applyLocal = () => {
      const {local} = self.env_
      const localSchema = local.get("SKMaterialPanel")
      localSchema && applySnapshot(self, localSchema)
    }

    const saveLocal = () => {
      const {local} = self.env_
      local.set("SKMaterialPanel", {
        toolbar: self.toolbar
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
          ":type": "data-folder",
          organizationId: self.root_.user.organizationId,
          sortArr: self.topFoldersId
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
          attachTo: false
        })
      }
    }

    // 删除文件夹
    const removeDataFolder = flow(function* removeDataFolder(folder) {
      const {tip, event} = self.env_
      try {
        yield io.data.removeDataFolder({":folderId": folder.folderId})

        folder.datas.forEach((data) => {
          event.fire("editor.closeTab", data.dataId)
        })

        event.fire("dataPanel.getDataFolder")
        tip.success({content: "删除文件夹成功"})
      } catch (error) {
        log.error(error)
        tip.error({content: "删除文件夹失败"})
      }
    })

    // 确认删除数据
    const confirmDeleteData = (data) => {
      const {dataName, dataId} = data
      self.root_.confirm({
        content: `确认删除数据“${dataName}”么？删除后无法恢复！`,
        onConfirm: () => self.removeData({dataId}),
        attachTo: false
      })
    }

    const removeData = flow(function* removeData({dataId}) {
      const {event} = self.env_
      try {
        yield io.data.removeData({":dataId": dataId})
        event.fire("dataPanel.getDataFolder")
        event.fire("editor.closeTab", dataId)
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    return {
      afterCreate,
      getDataFolder,
      applyLocal,
      saveLocal,
      openTabByData,
      createDataFolder,
      createFolderConfirm,
      stickyFolder,
      removeDataFolder,
      confirmDeleteData,
      removeData,
      confirmDeleteFolder
    }
  })
