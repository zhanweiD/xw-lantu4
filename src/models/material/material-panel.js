import commonAction from "@utils/common-action"
import {types, getEnv, flow, getRoot} from "mobx-state-tree"
import createLog from "@utils/create-log"
import config from "@utils/config"
import {MMaterial} from "./material-thumbnail"

const log = createLog("@models/material-panel.js")

const MFolder = types.model("MFolder", {
  folderId: types.number,
  folderName: types.string,
  isTop: types.optional(types.boolean, false),
  materials: types.optional(types.array(MMaterial), [])
})
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
    const {io, tip, event} = self.env_
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

    const toggleFolderTop = flow(function* toggleTop(folderId) {
      try {
        yield io.user.top({
          ":type": "folder",
          organizationId: self.root_.user.organizationId,
          ":folderId": folderId
        })
      } catch (error) {
        log.error("toggleTop Error: ", error)
        tip.error({content: error.message})
      }
    })

    const createFolder = flow(function* create(name) {
      try {
        yield io.material.createFolder({folderName: name})
        self.getFolders()
        tip.success({
          content: `“${name.length > 10 ? name.slice(0, 10) : name}”文件夹新建成功`
        })
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
      elink.style.display = "none"
      document.body.appendChild(elink)
      elink.click()
      document.body.removeChild(elink)
    }

    return {
      afterCreate,
      getFolders,
      createFolder,
      removeFolder,
      exportFolder,
      toggleFolderTop,
      toggleShowType,
      remove
    }
  })
