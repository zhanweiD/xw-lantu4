import commonAction from "@utils/common-action"
import {types, getEnv, flow, getRoot} from "mobx-state-tree"
import cloneDeep from "lodash/cloneDeep"
import createLog from "@utils/create-log"
import config from "@utils/config"
import {MFolder} from "./material-folder"

const log = createLog("@models/material-panel.js")

export const MMaterialPanel = types
  .model("MMaterialPanel", {
    folders: types.optional(types.array(MFolder), []),

    // 前端使用的属性
    // 创建文件夹弹窗是否展示
    isVisible: types.optional(types.boolean, false),
    // 搜索关键字
    keyword: types.optional(types.string, ""),
    // 列表展示类型 thumbnail-缩略图 grid-宫格缩略图 list-简略文字
    showType: types.optional(types.enumeration(["grid-layout", "list", "thumbnail-list"]), "thumbnail-list"),
    fetchState: types.optional(types.enumeration(["loading", "success", "error"]), "loading")
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    let bakFolders = []
    const {io, tip, event, session} = self.env_
    const afterCreate = () => {
      event.on("materialPanel.getFolders", self.getFolders)
      self.getFolders()
    }

    const toggleShowType = () => {
      let showType
      switch (self.showType) {
        case "thumbnail-list":
          showType = "grid-layout"
          break
        case "grid-layout":
          showType = "list"
          break
        case "list":
          showType = "thumbnail-list"
          break
        default:
          showType = "thumbnail-list"
      }
      self.folders.forEach((folder) => {
        session.set(`section-material-folder-${folder.folderId}`, false)
      })
      self.showType = showType
    }

    const getFolders = flow(function* getFolders() {
      try {
        const {list, folderSort} = yield io.material.getMaterials()
        const folders = list.map((folder) => ({
          ...folder,
          isTop: folderSort.includes(folder.folderId)
        }))
        self.set({
          folders,
          fetchState: "success"
        })
      } catch (error) {
        log.error("getFolders Error: ", error)
      }
    })

    const toggleFolderTop = flow(function* toggleTop(folder) {
      try {
        yield io.user.top({
          ":type": "material-folder",
          action: folder.isTop ? "cancel" : "top",
          id: folder.folderId
        })
        folder.set({
          isTop: !folder.isTop
        })
        tip.success({content: folder.isTop ? "置顶成功" : "取消置顶成功"})
      } catch (error) {
        log.error("toggleTop Error: ", error)
        tip.error({content: error.message})
      }
    })

    const createFolder = flow(function* create(name, cb) {
      if (!name) {
        tip.error({
          content: "文件夹名称不可为空"
        })
        return
      }
      try {
        yield io.material.createFolder({folderName: name})
        self.getFolders()
        tip.success({
          content: `“${name.length > 10 ? name.slice(0, 10) : name}”文件夹新建成功`
        })
        self.set({
          isVisible: false
        })
        cb()
      } catch (error) {
        log.error("createFolder Error: ", error)
        tip.error({content: error.message})
      }
    })

    const remove = flow(function* remove(folderId) {
      try {
        yield io.material.removeFolder({":folderId": folderId})
        self.getFolders()
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

    const searchFolders = () => {
      if (!self.keyword) {
        bakFolders.length && self.set({folders: bakFolders})
        bakFolders = []
        return
      }
      if (!bakFolders.length) {
        bakFolders = cloneDeep(self.folders.toJSON())
      }
      let runtimeFolders = cloneDeep(bakFolders)
      const folders = runtimeFolders.reduce((total, current) => {
        if (current.folderName.includes(self.keyword)) {
          total.push(current)
        } else {
          const materials = current.materials.filter((material) => material.name.includes(self.keyword))
          if (materials.length) {
            current.materials = materials
            total.push(current)
          }
        }
        return total
      }, [])
      self.set({
        folders
      })
    }
    return {
      afterCreate,
      getFolders,
      createFolder,
      searchFolders,
      removeFolder,
      exportFolder,
      toggleFolderTop,
      toggleShowType,
      remove
    }
  })
