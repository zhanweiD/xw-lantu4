import {getEnv, types} from 'mobx-state-tree'
import isFunction from 'lodash/isFunction'
import commonAction from '@utils/common-action'
import {MArt} from '../art/art'
import {MArtInit} from './editor-tab-art-init'
import {MProjectDetail} from './editor-tab-project-detail'
import {MMaterial} from './editor-tab-material'
import {MDataTab} from './editor-tab-data'
import {MDataSourceManager} from './editor-tab-data-manager'

export const MEditorTab = types
  .model({
    id: types.union(types.number, types.string),
    name: types.optional(types.string, ''),
    type: types.enumeration(['art', 'projectDetail', 'artInit', 'material', 'data', 'dataSourceManager']),
    projectDetail: types.maybe(MProjectDetail),
    material: types.maybe(MMaterial),
    data: types.maybe(MDataTab),
    initArt: types.maybe(MArtInit),
    tabOptions: types.optional(types.frozen(), {}),
    art: types.maybe(MArt),
    dataSourceManager: types.maybe(MDataSourceManager),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const showDetail = () => {
      const {event} = self.env_
      const {type, id, tabOptions} = self
      if (type === 'projectDetail') {
        // ! description 有问题，后续改
        const {name} = self
        self.projectDetail = {
          id,
          name,
        }
        self.projectDetail.getDetail()
      }
      if (type === 'artInit') {
        const {projectId} = tabOptions
        self.initArt = {
          name: '',
          id,
          projectId,
        }
      }
      if (type === 'art') {
        if (!self.art) {
          self.art = {
            artId: id,
          }
          self.art.getArt()
        }
      }
      if (type === 'material') {
        if (!self.material) {
          const {projectId, folderId} = self.tabOptions
          self.material = {
            materialId: self.id,
            projectId,
            folderId,
          }
          self.material.getMaterialDetail()
        }
      }
      // 设置项目素材的 projectId
      // TODO: 非项目素材打开的时候会与当前激活的项目绑定，待优化
      if (type !== 'art' && type !== 'material' && type !== 'data') {
        event.fire('materialPanel.setProjectId', {projectId: null})
        event.fire('dataPanel.setProjectId', {projectId: null})
      } else {
        const {projectId} = self.tabOptions
        event.fire('materialPanel.setProjectId', {
          projectId,
        })
        event.fire('dataPanel.setProjectId', {
          projectId,
        })
      }
      if (type === 'data') {
        if (!self.data) {
          const {dataType, folderId, projectId = null} = tabOptions
          self.data = {
            dataId: typeof id === 'number' ? id : 0,
            dataType,
            folderId,
            projectId,
          }
          self.data.getData()
        }
      }
      if (type === 'dataSourceManager') {
        if (!self.dataSourceManager) {
          self.dataSourceManager = {
            id,
            ...tabOptions,
          }
          self.dataSourceManager.getDatabaseSource()
        }
      }
    }

    const save = () => {
      const {type, art, data, material} = self
      if (type === 'art' && art && isFunction(art.save)) {
        art.save()
      }
      if (type === 'data' && data) {
        data.saveData()
      }
      if (type === 'material' && material) {
        material.save()
      }
    }

    return {
      showDetail,
      save,
    }
  })
