import onerStorage from 'oner-storage'
import {getEnv, types, flow} from 'mobx-state-tree'
import io from '@utils/io'
import commonAction from '@utils/common-action'
import createLog from '@utils/create-log'
import {MDataManager, MMaterialManager} from './art-manager'
import {MArtViewport} from './art-viewport'
import {MPublishInfo} from './art-publish-info'
import config from '@utils/config'
import {MGlobal} from './art-ui-tab-property'
import {MData} from '../data2/data'

const log = createLog('@models/art.js')

export const MArt = types
  .model('MArt', {
    artId: types.number,
    projectId: types.maybe(types.number),
    publishId: types.maybe(types.string),
    // 数据屏全局信息
    global: types.optional(MGlobal, {}),
    // 数据屏可视化区域
    viewport: types.optional(MArtViewport, {}),
    // 数据屏的发布版本信息
    artPublishInfo: types.maybe(MPublishInfo),
    // 数据屏使用的数据id及其映射组件的关系
    dataManager: types.optional(MDataManager, {}),
    materialManager: types.optional(MMaterialManager, {}),
    // 数据屏使用的数据，每次打开或更新均需要重新获取，不必保存
    datas: types.frozen(),
    // 前端工具属性 不必保存
    isArtPublishInfoVisible: types.optional(types.boolean, false),
    isGridVisible: types.optional(types.boolean, true),
    isBoxBackgroundVisible: types.optional(types.boolean, true),
    isSnap: types.optional(types.boolean, true),
    activeTool: types.optional(types.enumeration('MArtToolbar.activeTool', ['select', 'createFrame']), 'select'),
    fetchState: types.optional(types.enumeration('MArtTab.fetchState', ['loading', 'success', 'error']), 'loading'),
    normalKeys: types.frozen(['artId', 'projectId']),
    deepKeys: types.frozen(['viewport', 'dataManager', 'materialManager', 'global']),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .actions(commonAction(['set', 'getSchema', 'setSchema']))
  .actions((self) => {
    const afterCreate = () => {
      const {event} = self.env_
      const exhibitManager = onerStorage({
        type: 'variable',
        key: `waveview-exhibit-manager`,
      })
      self.exhibitManager = exhibitManager
      // 注册2个事件
      // 1、增加数据屏中组件依赖的数据id和组件id，若数据已经被记录则在此条记录中追加记录依赖此数据的组件id
      // 2、删除数据屏中组件依赖的数据id
      event.on(`art.${self.artId}.addData`, ({exhibitId, dataId, callback}) => {
        if (self.dataManager.get(dataId)) {
          const mData = self.dataManager.get(dataId)
          mData.addExhibit(exhibitId)
          callback()
        } else {
          self.dataManager.create({
            id: dataId,
            usedByExhibits: [exhibitId],
          })
          if (!self.datas) {
            self.set({
              datas: [],
            })
          }
          self.save()
          self.addData(dataId, callback)
        }
      })
      event.on(`art.${self.artId}.removeData`, ({exhibitId, dataId, callback}) => {
        const data = self.dataManager.get(dataId)
        data.removeExhibit(exhibitId)
        callback()
        self.save()
      })

      event.on(`art.${self.artId}.addMaterial`, ({id, materialId}) => {
        if (self.materialManager.get(materialId)) {
          const material = self.materialManager.get(materialId)
          material.add(id)
        } else {
          self.materialManager.create({
            id: materialId,
            used: [id],
          })
        }
        self.save()
      })

      event.on(`art.${self.artId}.removeMaterial`, ({id, materialId}) => {
        const material = self.materialManager.get(materialId)
        material.remove(id)
        self.save()
      })
    }

    const addData = flow(function* addData(dataId, callback) {
      try {
        const datas = yield io.data.getDatasInfo({
          ids: dataId,
        })
        const dataModel = []
        datas.forEach((data) => {
          dataModel.push(
            MData.create({
              ...data,
            })
          )
        })

        self.set({
          datas: self.datas.concat(...dataModel),
        })
        callback()
      } catch (error) {
        log.error('addData Error: ', error)
      }
    })

    // 获取数据屏相关信息
    const getArt = flow(function* getArt() {
      self.fetchState = 'loading'
      const {event} = self.env_
      try {
        const art = yield io.art.getDetail({
          ':artId': self.artId,
          hasBoxes: true,
        })
        const {publishId, projectId, frames, global} = art
        self.set({
          projectId,
          publishId,
        })
        const ids = []
        let data = []
        self.dataManager = art.dataManager
        self.materialManager = art.materialManager
        self.dataManager.map.forEach((value, key) => {
          ids.push(key)
        })
        // 如果有依赖其他数据源:全局数据源或者项目数据源 则去请求相关数据。
        if (ids.length > 0) {
          data = yield io.data.getDatasInfo({
            ids: ids.join(','),
          })
        }

        self.datas = data.map((v) => {
          return MData.create({
            ...v,
          })
        })
        self.global.setSchema(global)
        self.viewport.setSchema({
          frames,
        })
        self.artPublishInfo = {
          publishId: art.publishId,
          projectId: art.projectId,
          artId: art.artId,
        }
        event.fire('materialPanel.setProjectId', {
          projectId,
        })
        event.fire('dataPanel.setProjectId', {
          projectId,
        })
        self.fetchState = 'success'
      } catch (error) {
        self.fetchState = 'error'
        log.error('getArt Error:', error)
      }
    })

    // 预览数据屏
    const preview = () => {
      self.save()
      setTimeout(() => {
        window.open(`${window.location.origin}${config.pathPrefix}/preview/${self.artId}`, 'previewWindow')
      }, 10)
      // window.open(`${window.location.origin}${config.pathPrefix}/preview/${self.artId}`, 'previewWindow')
    }

    const save = flow(function* save() {
      try {
        const {global, viewport, artId, projectId, dataManager, materialManager} = self.getSchema()
        const {frames} = viewport
        frames.forEach((frame) => {
          const {boxes} = frame
          if (frame.materials) {
            const materials = []
            frame.materials.forEach((m) => {
              const materialModel = self.exhibitManager.get(m.id)
              if (materialModel) {
                const schema = materialModel.getSchema()
                materials.push(schema)
              }
            })
            frame.materials = materials
          }
          boxes.forEach((box) => {
            if (box.exhibit) {
              const exhibitModel = self.exhibitManager.get(box.exhibit.id)
              if (exhibitModel) {
                const schema = exhibitModel.getSchema()
                box.exhibit = schema
              }
            }
            if (box.materials) {
              const materials = []
              box.materials.forEach((m) => {
                const materialModel = self.exhibitManager.get(m.id)
                if (materialModel) {
                  const schema = materialModel.getSchema()
                  materials.push(schema)
                }
              })
              box.materials = materials
            }
          })
        })
        const params = {
          ':projectId': projectId,
          ':artId': artId,
          dataManager,
          materialManager,
          global,
          frames,
        }
        yield io.art.update(params)
        self.env_.tip.success({content: '保存成功'})
      } catch (error) {
        log.error('save Error: ', error)
        self.env_.tip.error({content: '保存失败'})
      }
    })
    return {
      afterCreate,
      getArt,
      addData,
      preview,
      save,
    }
  })
