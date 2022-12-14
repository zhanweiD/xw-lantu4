import {types, getEnv, flow, getParent} from 'mobx-state-tree'
import config from '@utils/config'
import uuid from '@utils/uuid'
import commonAction from '@utils/common-action'
import {MArtThumbnail} from '../art/art-thumbnail'
import {MDataTab} from '../editor/editor-tab-data'
import createLog from '@utils/create-log'

const log = createLog('@models/project/project-list.js')

export const MProjectList = types
  .model({
    name: types.string,
    description: types.maybe(types.string),
    projectId: types.union(types.string, types.number),
    arts: types.optional(types.array(MArtThumbnail), []),
    // 数据屏排序数据
    artSort: types.optional(types.array(types.number), []),
    // 项目数据
    dataList: types.optional(types.array(MDataTab), []),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get projectPanel_() {
      return getParent(self, 2)
    },
    // 获取展示的数据屏（排序搜索后的结果）
    get arts_() {
      const {keyword} = self.projectPanel_
      const sortedArts = self.artSort.map((id) => self.arts.find((art) => art.artId === id)).filter(Boolean)
      const unsortedArts = self.arts.filter((art) => !self.artSort.includes(art.artId))
      const total = [...sortedArts, ...unsortedArts]
      return self.name.match(keyword) ? total : total.filter(({name}) => name.match(keyword))
    },
    get dataList_() {
      return self.dataList
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    // 项目数据相关
    const afterCreate = () => {
      const {event} = self.env_
      self.dataList?.forEach((data) => data.set({isProject: true, projectId: self.projectId}))
      event.off(`projectThumbnail.updateData${self.projectId}`)
      event.on(`projectThumbnail.updateData${self.projectId}`, ({dataList}) => self.set(dataList))
    }

    // 新建新的数据屏
    const createArt = () => {
      const {event} = self.env_
      event.fire('editor.openTab', {
        type: 'artInit',
        name: '新建数据屏',
        id: uuid(),
        tabOptions: {projectId: self.projectId},
      })
    }

    // 从文件导入数据屏
    const importArt = flow(function* importArt(files, projectId) {
      // console.log(files[0].type,files[0], projectId)
      const {tip, event} = self.env_
      const formData = new FormData()
      formData.append(files[0].type, files[0], files[0].name)
      try {
        yield fetch(`${config.urlPrefix}project/${projectId}/import/art`, {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((content) => {
            if (content.success) {
              tip.success({content: '数据屏导入成功'})
              event.fire('project-panel.getProjects')
            } else {
              tip.error({content: content.message})
            }
          })
      } catch (error) {
        log.error(error)
        tip.error({content: error.message})
      }
    })

    // 打开项目详情面板
    const editProject = () => {
      const {event} = self.env_
      const {name, projectId, description} = self
      event.fire('editor.openTab', {
        type: 'projectDetail',
        name,
        description,
        id: projectId,
      })
    }

    // 数据屏排序
    const moveArtSort = (sourcceIndex, targetIndex) => {
      if (!self.artSort) {
        self.artSort = self.arts.map((art) => art.artId)
      }
      // 如果 artSort 与 arts 长度不一致，则保证 artSort 顺序前提下，往后追加剩余 art 的顺序
      if (self.artSort.length !== self.arts.length) {
        const sortArtIds = self.artSort.filter((id) => self.arts.find((art) => art.artId === id))
        const unsortedArtIds = self.arts.map(({artId}) => artId).filter((artId) => !sortArtIds.includes(artId))
        self.artSort = [...sortArtIds, ...unsortedArtIds]
      }
      // 交换顺序
      const artSort = self.artSort.toJSON()
      const temp = artSort[sourcceIndex]
      artSort[sourcceIndex] = artSort[targetIndex]
      artSort[targetIndex] = temp
      self.artSort = artSort
    }

    // 保存排序结果
    const saveArtSort = flow(function* saveArtSort() {
      const {tip, io} = self.env_
      try {
        yield io.project.sort({
          ':projectId': self.projectId,
          artSort: self.artSort,
        })
      } catch (error) {
        log.error(error)
        tip.error({content: error.message, isManuallyClose: true})
        self.state = 'fail'
      }
    })

    return {
      createArt,
      importArt,
      editProject,
      moveArtSort,
      saveArtSort,
      afterCreate,
    }
  })
