import {getEnv, types} from "mobx-state-tree"
import isFunction from "lodash/isFunction"
import commonAction from "@utils/common-action"
import {MArt} from "../art/art"
import {MArtInit} from "./editor-tab-art-init"
import {MProjectDetail} from "./editor-tab-project-detail"
import {MArtDetail} from "./editor-tab-art-detail"
import {MMaterialTab} from "./editor-tab-material-thumbnail"
import {MDataTab} from "./editor-tab-data"
import {MDataSourceManager} from "./editor-tab-data-manager"

export const MEditorTab = types
  .model({
    id: types.union(types.number, types.string),
    name: types.optional(types.string, ""),
    type: types.enumeration([
      "art",
      "projectInit",
      "projectDetail",
      "artInit",
      "material",
      "data",
      "artDetail",
      "dataSourceManager"
    ]),
    projectDetail: types.maybe(MProjectDetail),
    artDetail: types.maybe(MArtDetail),
    materialThumbnail: types.maybe(MMaterialTab),
    data: types.maybe(MDataTab),
    initArt: types.maybe(MArtInit),
    tabOptions: types.frozen(),
    art: types.maybe(MArt),
    dataSourceManager: types.maybe(MDataSourceManager)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const showDetail = () => {
      const {type, id, tabOptions} = self
      if (type === "projectDetail") {
        // ! description 有问题，后续改
        const {name} = self
        self.projectDetail = {
          id,
          name
        }
        self.projectDetail.getDetail()
      }
      if (type === "artDetail") {
        self.artDetail = tabOptions
        self.artDetail.getDetail()
      }
      if (type === "artInit") {
        const {projectId} = tabOptions
        self.initArt = {
          name: "",
          id,
          projectId
        }
      }
      if (type === "art") {
        if (!self.art) {
          self.art = {
            artId: id
          }
          self.art.getArt()
        }
      }
      if (type === "material") {
        console.log(self.id, self.tabOptions, self.type)
        self.materialThumbnail = {
          id: self.id
        }
        self.materialThumbnail.getMaterialDetail()
        setTimeout(() => {
          self.materialThumbnail.initZoom()
        }, 0)
      }
      if (type === "data") {
        if (!self.data) {
          const {dataType, folderId, isProject, projectId = 0} = tabOptions
          self.data = {
            dataId: typeof id === "number" ? id : 0,
            dataType,
            folderId,
            isProject,
            projectId
          }
          self.data.getData()
        }
      }

      if (type === "dataSourceManager") {
        if (!self.dataSourceManager) {
          self.dataSourceManager = {
            id,
            ...tabOptions
          }
          self.dataSourceManager.getDatabaseSource()
        }
      }
    }

    const save = () => {
      const {type, art, data, materialThumbnail} = self
      if (type === "art" && art && isFunction(art.save)) {
        art.save()
      }
      if (type === "data" && data) {
        data.saveData()
      }
      if (type === "material" && materialThumbnail) {
        materialThumbnail.save()
      }
    }

    return {
      showDetail,
      save
    }
  })
