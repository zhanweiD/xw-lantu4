import commonAction from "@utils/common-action"
import {types, getEnv, flow, getRoot} from "mobx-state-tree"
import createLog from "@utils/create-log"
import config from "@utils/config"
import {MFolder} from "./material-folder"
import {cloneDeep} from "lodash"

const log = createLog("@models/material-panel.js")

export const MMaterialPanel = types
  .model("MMaterialPanel", {
    // 空间素材
    folders: types.optional(types.array(MFolder), []),
    folderSort: types.optional(types.array(types.number), []),
    // 项目素材
    projectId: types.maybeNull(types.number),
    projectFolders: types.optional(types.array(MFolder), []),
    projectFolderSort: types.optional(types.array(types.number), []),
    // 前端使用的属性：创建文件夹弹窗是否展示
    isVisible: types.optional(types.boolean, false),
    // 搜索关键字
    keyword: types.optional(types.string, ""),
    // 列表展示类型 thumbnail-缩略图 grid-宫格缩略图 list-简略文字
    showType: types.optional(types.enumeration(["grid-layout", "list", "thumbnail-list"]), "thumbnail-list"),
    // 对应 Loading 组件的状态
    state: types.optional(types.enumeration(["loading", "success", "error"]), "loading")
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get folders_() {
      let total = cloneDeep(self.folders.toJSON())
      // 搜索关键字匹配文件夹名和素材名
      if (self.keyword) {
        total = total
          .map((folder) => {
            if (!folder.folderName.match(self.keyword)) {
              folder.materials = folder.materials.filter(({name}) => name.match(self.keyword))
            }
            return folder.materials.length > 0 ? folder : null
          })
          .filter(Boolean)
      }
      // 区分置顶与非置顶
      const topFolderIds = self.folderSort.filter((id) => total.find((folder) => folder.folderId === id))
      const basicFolderIds = total.map(({folderId}) => !topFolderIds.includes(folderId) && folderId).filter(Boolean)
      return {
        topFolders: topFolderIds.map((id) => self.folders.find(({folderId}) => folderId === id)),
        basicFolders: basicFolderIds.map((id) => self.folders.find(({folderId}) => folderId === id))
      }
    },
    get projectFolders_() {
      let total = cloneDeep(self.projectFolders.toJSON())
      // 搜索关键字匹配文件夹名和素材名
      if (self.keyword) {
        total = total
          .map((folder) => {
            if (!folder.folderName.match(self.keyword)) {
              folder.materials = folder.materials.filter(({name}) => name.match(self.keyword))
            }
            return folder.materials.length > 0 ? folder : null
          })
          .filter(Boolean)
      }
      // 区分置顶与非置顶
      const topFolderIds = self.projectFolderSort.filter((id) => total.find((folder) => folder.folderId === id))
      const basicFolderIds = total.map(({folderId}) => !topFolderIds.includes(folderId) && folderId).filter(Boolean)
      return {
        topProjectFolders: topFolderIds.map((id) => self.projectFolders.find(({folderId}) => folderId === id)),
        basicProjectFolders: basicFolderIds.map((id) => self.projectFolders.find(({folderId}) => folderId === id))
      }
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const {io, tip, event, session} = self.env_
    const afterCreate = () => {
      event.on("materialPanel.getFolders", self.getFolders)
      event.on("materialPanel.getProjectFolders", self.getProjectFolders)
      event.on("materialPanel.setProjectId", self.setProjectId)
      self.getFolders()
    }

    // 切换展示方式
    const toggleShowType = () => {
      switch (self.showType) {
        case "thumbnail-list":
          self.showType = "grid-layout"
          break
        case "grid-layout":
          self.showType = "list"
          break
        case "list":
          self.showType = "thumbnail-list"
          break
        default:
          self.showType = "thumbnail-list"
      }
    }

    // 获取空间素材
    const getFolders = flow(function* getFolders() {
      try {
        const {list: folders, folderSort} = yield io.material.getMaterials()
        self.set({
          folders,
          folderSort,
          state: "success"
        })
      } catch (error) {
        log.error("getFolders Error: ", error)
      }
    })

    // 获取项目素材
    const getProjectFolders = flow(function* getFolders() {
      try {
        const {list: folders, folderSort} = yield io.material.getProjectMaterials({":projectId": self.projectId})
        self.set({
          projectFolders: folders,
          projectFolderSort: folderSort,
          state: "success"
        })
      } catch (error) {
        log.error("getProjectFolders Error: ", error)
      }
    })

    // 项目ID变化时更新项目素材
    const setProjectId = ({projectId}) => {
      if (projectId !== self.projectId) {
        self.projectId = projectId
        if (projectId === null) {
          self.projectFolders = []
        } else {
          self.getProjectFolders()
        }
      }
    }

    // 置顶和取消置顶，区分项目素材和空间素材
    const toggleFolderTop = flow(function* toggleTop(folder) {
      const tabIndex = session.get("tab-material-panel-tab", -1)
      let isTop
      if (tabIndex === 0 && self.projectId) {
        isTop = self.projectFolderSort.includes(folder.folderId)
      } else if (tabIndex === 1) {
        isTop = self.folderSort.includes(folder.folderId)
      }
      try {
        yield io.user.top({
          ":type": "material-folder",
          action: isTop ? "cancel" : "top",
          id: folder.folderId,
          projectId: self.projectId || null
        })
        tip.success({content: isTop ? "取消置顶成功" : "置顶成功"})
        if (tabIndex === 0 && self.projectId) {
          isTop ? self.projectFolderSort.remove(folder.folderId) : self.projectFolderSort.unshift(folder.folderId)
        } else if (tabIndex === 1) {
          isTop ? self.folderSort.remove(folder.folderId) : self.folderSort.unshift(folder.folderId)
        }
      } catch (error) {
        log.error("toggleTop Error: ", error)
        tip.error({content: error.message})
      }
    })

    // 创建素材文件夹，区分项目素材和空间素材
    const createFolder = flow(function* create(name, callback) {
      const tabIndex = session.get("tab-material-panel-tab", -1)
      if (!name) {
        tip.error({content: "文件夹名称不可为空"})
        return
      }
      try {
        if (tabIndex === 0 && self.projectId) {
          yield io.material.createProjectFolder({":projectId": self.projectId, folderName: name})
          self.getProjectFolders()
        } else if (tabIndex === 1) {
          yield io.material.createFolder({folderName: name})
          self.getFolders()
        } else {
          throw new Error("当前无关联的数据屏")
        }
        self.set({isVisible: false})
        tip.success({content: `“${name.length > 10 ? name.slice(0, 10) : name}”文件夹新建成功`})
        callback()
      } catch (error) {
        log.error("createFolder Error: ", error)
        tip.error({content: error.message})
      }
    })

    // 删除素材文件夹，区分项目素材和空间素材
    const remove = flow(function* remove(folderId) {
      const tabIndex = session.get("tab-material-panel-tab", -1)
      try {
        if (tabIndex === 0 && self.projectId) {
          yield io.material.removeProjectFolder({":projectId": self.projectId, ":folderId": folderId})
          self.getProjectFolders()
        } else if (tabIndex === 1) {
          yield io.material.removeFolder({":folderId": folderId})
          self.getFolders()
        } else {
          throw new Error("当前无关联的数据屏")
        }
      } catch (error) {
        log.error("removeFolder Error: ", error)
        tip.error({content: error.message})
      }
    })

    const removeFolder = (folder) => {
      const count = folder.materials.length
      if (!count) {
        self.remove(folder.folderId)
      } else {
        self.root_.confirm({
          content: `“${folder.folderName}”下有${count}个素材，您确定要删除吗？`,
          onConfirm: () => self.remove(folder.folderId),
          attachTo: false
        })
      }
    }

    const exportFolder = (folder) => {
      const elink = document.createElement("a")
      elink.href = `${config.urlPrefix}material/folder/${folder.folderId}/export`
      elink.name = folder.name
      elink.style.display = "none"
      document.body.appendChild(elink)
      elink.click()
      document.body.removeChild(elink)
    }

    return {
      afterCreate,
      getFolders,
      getProjectFolders,
      setProjectId,
      createFolder,
      removeFolder,
      exportFolder,
      toggleFolderTop,
      toggleShowType,
      remove
    }
  })
