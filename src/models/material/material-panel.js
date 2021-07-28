/**
 * @author 南风
 * @description 素材管理面板
 */
import {
  types,
  getEnv,
  flow,
  getParent,
  applySnapshot,
  getRoot
} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import {createConfigModelClass} from "@components/field"
import {MMaterialThumbnail} from "./material-thumbnail"
import {MMaterialToolbar} from "./material-toolbar"
import {MMaterialCreater} from "./material-creater"

const MMaterialType = types
  .model("MMaterialType", {
    name: types.string,
    type: types.string,
    whitelist: types.optional(types.array(types.string), [])
  })
  .views((self) => ({
    get materialList_() {
      return getParent(self, 2).materials.filter(
        (material) => self.type === material.type
      )
    },
    get env_() {
      return getEnv(self)
    }
  }))

const MMaterialFolder = types
  .model("MMaterialFolder", {
    folderId: types.number,
    folderName: types.string,
    materialSort: types.optional(types.array(types.number), []),
    materials: types.optional(types.array(MMaterialThumbnail), [])
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get materials_() {
      return self.materials.length && self.materialSort.length
        ? self.materialSort.map(self.getMaterialById)
        : self.materials
    }
  }))
  .actions((self) => {
    const getMaterialById = (id) => {
      return self.materials.find((material) => material.id === id)
    }

    const moveMaterialSort = (sourcceIndex, targetIndex) => {
      if (!self.materialSort.length) {
        self.materialSort = self.materials.map((material) => material.id)
      }
      const materialSort = [...self.materialSort]
      const tmp = materialSort[sourcceIndex] // 临时储存文件
      materialSort.splice(sourcceIndex, 1) // 移除拖拽项
      materialSort.splice(targetIndex, 0, tmp) // 插入放置项
      self.materialSort = materialSort
    }

    const saveMaterialSort = flow(function* saveMaterialSort() {
      const {tip, log, io} = self.env_
      try {
        yield io.material.sort({
          ":folderId": self.folderId,
          materialSort: self.materialSort
        })
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
        log.error("MaterialSort.Error:", error)
      }
    })

    return {
      getMaterialById,
      moveMaterialSort,
      saveMaterialSort
    }
  })

export const MMaterialPanel = types
  .model({
    name: "materialPanel",
    toolbar: types.optional(MMaterialToolbar, {}),
    types: types.optional(types.array(MMaterialType), []),
    topFolders: types.optional(types.array(types.number), []),
    folders: types.optional(types.array(MMaterialFolder), []),
    creater: types.optional(MMaterialCreater, {}),

    state: types.optional(
      types.enumeration(["loading", "success", "error"]),
      "loading"
    )
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get materialCategorys_() {
      return self.types.filter(({type}) => type !== "all")
    },
    get folders_() {
      const basicFolders = []
      const topFolders = []
      self.folders.forEach((folder) => {
        if (self.topFolders.includes(folder.folderId)) {
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
    get hasMaterial_() {
      return !!self.folders.length
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      self.getMaterialTypes()
      self.getMaterials()
      event.on("materialPanel.getMaterials", self.getMaterials)
      self.applyLocal()
    }

    const getMaterialTypes = flow(function* getMaterialTypes() {
      const {io} = self.env_
      try {
        const materialTypes = yield io.material.getTypes()
        self.types = [
          {
            name: "全部",
            type: "all",
            whitelist: []
          }
        ].concat(materialTypes)
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const createFolderConfirm = () => {
      const modal = self.root_.overlayManager.get("fieldModal")

      const MFieldModal = createConfigModelClass("MFieldModal", {
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
        content: MFieldModal.create(),
        height: 160,
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
              self.createFolder(schema)
            }
          }
        ]
      })
    }

    const createFolder = flow(function* createFolder({name}) {
      const modal = self.root_.overlayManager.get("fieldModal")
      const {io, event, tip} = self.env_
      try {
        yield io.material.createFolder({folderName: name})
        event.fire("materialPanel.getMaterials")
        tip.success({
          content: `“${
            name.length > 10 ? name.slice(0, 10) : name
          }”文件夹新建成功`
        })
        modal.hide()
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
        tip.error({content: error.message})
      }
    })

    const removeFolderConfirm = (folder) => {
      const materialCount = folder.materials.length
      if (!materialCount) {
        self.removeFolder(folder)
      } else {
        self.root_.confirm({
          content: `“${folder.folderName}”下有${materialCount}个素材，您确定要删除吗？`,
          onConfirm: () => self.removeFolder(folder),
          attachTo: false
        })
      }
    }

    const removeFolder = flow(function* removeFolder({folderId}) {
      const {io, event} = self.env_
      try {
        yield io.material.removeFolder({":folderId": folderId})
        event.fire("materialPanel.getMaterials")
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
      }
    })

    const getMaterials = flow(function* getMaterials() {
      const {io} = self.env_
      try {
        const materials = yield io.material.getMaterials()
        self.topFolders = materials.folderSort
        self.folders = materials.list
        self.set({state: "success"})
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
        self.set({state: "error"})
      }
    })

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

    const upload = (folderId) => {
      self.creater.activeFolderId = folderId
      self.root_.overlayManager.get("materialModal").show({
        title: "上传素材",
        attachTo: false
      })
    }

    const toggleFolderTop = flow(function* toggleFolderTop(folder, isTop) {
      if (isTop || self.topFolders.includes(folder.folderId)) {
        self.topFolders = self.topFolders.filter(
          (sortId) => sortId !== folder.folderId
        )
      } else {
        self.topFolders.push(folder.folderId)
      }
      const {io, tip} = self.env_
      try {
        yield io.user.top({
          ":type": "folder",
          organizationId: self.root_.user.organizationId,
          sortArr: self.topFolders
        })
      } catch (error) {
        // TODO error 统一替换
        console.log(error)
        tip.error({content: error.message})
      }
    })

    return {
      afterCreate,
      getMaterials,
      getMaterialTypes,
      createFolder,
      applyLocal,
      saveLocal,
      createFolderConfirm,
      upload,
      removeFolderConfirm,
      removeFolder,
      toggleFolderTop
    }
  })
