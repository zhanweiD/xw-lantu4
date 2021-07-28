/**
 * @author 南风
 * @description 项目管理面板-单个项目
 */
import {types, getEnv, flow, getParent} from "mobx-state-tree"
import config from "@utils/config"
import uuid from "@utils/uuid"
import commonAction from "@utils/common-action"
import {MArtThumbnail} from "../art/art-thumbnail"
import {MDataTab} from "../editor/editor-tab-data"

export const MProjectThumbnail = types
  .model({
    projectId: types.union(types.string, types.number),
    name: types.string,
    description: types.string,
    arts: types.optional(types.array(MArtThumbnail), []),
    artSort: types.optional(types.array(types.number), []),
    dataList: types.optional(types.array(MDataTab), []),

    isNew: types.optional(types.boolean, false)
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get projectPanel_() {
      return getParent(self, 2)
    },
    get arts_() {
      if (self.arts.length && self.artSort.length) {
        const sortArtIds = self.artSort.filter(self.getArtById)
        const sortArts = sortArtIds.map(self.getArtById)
        const unSortArts = self.arts.filter(
          (art) => !sortArtIds.includes(art.artId)
        )
        return [...sortArts, ...unSortArts]
      }
      return self.arts
    },
    get dataList_() {
      return self.dataList
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      self.dataList?.forEach((data) => {
        data.set({
          isProject: true,
          projectId: self.projectId
        })
      })
      event.off(`projectThumbnail.updateData${self.projectId}`)
      event.on(`projectThumbnail.updateData${self.projectId}`, self.updateData)
    }

    const createArt = () => {
      const {event} = self.env_
      event.fire("editor.openTab", {
        type: "artInit",
        name: "新建数据屏",
        id: uuid(),
        tabOptions: {projectId: self.projectId}
      })
    }

    const importArt = flow(function* importArt(files, projectId) {
      const {tip, log, event} = self.env_
      const formData = new FormData()

      formData.append(files[0].type, files[0], files[0].name)

      try {
        yield fetch(`${config.urlPrefix}project/${projectId}/import/art`, {
          method: "POST",
          body: formData
        })
          .then((response) => response.json())
          .then((content) => {
            if (content.success) {
              tip.success({content: "数据屏导入成功"})
              event.fire("project-panel.getProjects")
            } else {
              tip.error({content: content.message})
            }
          })
      } catch (error) {
        tip.error({content: error.message})
        log.error("create.Error:", error)
      }
    })

    const updateProject = () => {
      const {event} = self.env_
      const {name, projectId, description} = self
      event.fire("editor.openTab", {
        type: "projectDetail",
        name,
        description,
        id: projectId
      })
    }

    const moveArtSort = (sourcceIndex, targetIndex) => {
      // 如果没有 artSort 那么前端生成默认 artSort
      if (!self.artSort.length) {
        self.artSort = self.arts.map((art) => art.artId)
      }
      // 如果 artSort 与 arts 长度不一致，则保证 artSort 顺序前提下，往后追加剩余 art 的顺序
      if (self.artSort.length !== self.arts.length) {
        // 去除脏的 artSort 数据项
        const sortArtIds = self.artSort.filter(self.getArtById)
        const unSortArts = self.arts
          .map(({artId}) => artId)
          .filter((artId) => !sortArtIds.includes(artId))
        self.artSort = [...sortArtIds, ...unSortArts]
      }
      const artSort = [...self.artSort]
      const tmp = artSort[sourcceIndex] // 临时储存文件
      artSort.splice(sourcceIndex, 1) // 移除拖拽项
      artSort.splice(targetIndex, 0, tmp) // 插入放置项
      self.artSort = artSort
    }

    const saveArtSort = flow(function* saveArtSort() {
      const {tip, log, io} = self.env_

      try {
        yield io.project.sort({
          ":projectId": self.projectId,
          artSort: self.artSort
        })
      } catch (error) {
        tip.error({content: error.message, isManuallyClose: true})
        log.error("ProjectSort.Error:", error)
        self.state = "fail"
      }
    })

    const getArtById = (artId) => {
      return self.arts.find((art) => art.artId === artId)
    }

    const updateData = ({dataList}) => {
      self.dataList = dataList
    }

    return {
      createArt,
      importArt,
      updateProject,
      moveArtSort,
      getArtById,
      saveArtSort,
      updateData,
      afterCreate
    }
  })
