/*
 * @Author: 柿子
 * @Date: 2021-07-29 15:02:53
 * @LastEditTime: 2021-08-09 17:13:10
 * @LastEditors: Please set LastEditors
 * @Description: 数据屏的数据模型根目录
 * @FilePath: /waveview-front4/src/models/new-art/art.js
 */
import onerStorage from 'oner-storage'
import {getEnv, types, flow} from 'mobx-state-tree'
import io from '@utils/io'
import commonAction from '@utils/common-action'
import createLog from '@utils/create-log'
import {MDataManager} from './art-data-manager'
import {MArtBasic} from './art-basic'
import {MArtViewport} from './art-viewport'
import {MPublishInfo} from './art-publish-info'
import config from '@utils/config'

const log = createLog('@models/art.js')

export const MArt = types
  .model('MArt', {
    artId: types.number,
    projectId: types.maybe(types.number),
    publishId: types.maybe(types.string),
    // 数据屏全局信息
    basic: types.optional(MArtBasic, {}),
    // 数据屏可视化区域
    viewport: types.optional(MArtViewport, {}),
    // 数据屏的发布版本信息
    artPublishInfo: types.maybe(MPublishInfo),
    // 数据屏使用的数据id及其映射组件的关系
    dataManager: types.optional(MDataManager, {}),
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
    deepKeys: types.frozen(['viewport', 'dataManager', 'basic']),
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
      event.on(`art.${self.artId}.addData`, ({exhibitId, dataId}) => {
        if (self.dataManager.get(dataId)) {
          const mData = self.dataManager.get(dataId)
          mData.addExhibit(exhibitId)
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
          self.addData(dataId)
        }
      })
      event.on(`art.${self.artId}.removeData`, ({exhibitId, dataId}) => {
        const data = self.dataManager.get(dataId)
        data.removeExhibit(exhibitId)
      })
    }

    const addData = flow(function* addData(dataId) {
      try {
        const data = yield io.data.getDatasInfo({
          ids: dataId,
        })
        self.set({
          datas: self.datas.concat(data),
        })
      } catch (error) {
        log.error('addData Error: ', error)
      }
    })

    // 获取大屏相关信息
    const getArt = flow(function* getArt() {
      self.fetchState = 'loading'
      try {
        const art = yield io.art.getDetail({
          ':artId': self.artId,
          hasBoxes: true,
        })
        const {publishId, projectId, themeId, gridUnit, watermark, password, frames} = art
        self.set({
          projectId,
          publishId,
        })
        const ids = []
        let data
        self.dataManager = art.dataManager
        self.dataManager.map.forEach((value, key) => {
          ids.push(key)
        })
        // 如果有依赖其他数据源:全局数据源或者项目数据源 则去请求相关数据。
        if (ids.length > 0) {
          data = yield io.data.getDatasInfo({
            ids: ids.join(','),
          })
        }

        self.datas = data
        self.basic.setSchema({
          themeId: themeId || 'glaze',
          gridUnit,
          watermark,
          password,
        })
        self.viewport.setSchema({
          frames,
        })
        self.artPublishInfo = {
          publishId: art.publishId,
          projectId: art.projectId,
          artId: art.artId,
        }
        self.fetchState = 'success'
      } catch (error) {
        self.fetchState = 'error'
        log.error('getArt Error:', error)
      }
    })

    // 预览数据屏
    const preview = () => {
      window.open(`${window.location.origin}${config.pathPrefix}/preview/${self.artId}`, 'previewWindow')
    }

    const save = flow(function* save() {
      try {
        const {basic, viewport, artId, projectId, dataManager} = self.getSchema()
        const {frames} = viewport
        frames.forEach((frame) => {
          const {boxes} = frame
          boxes.forEach((box) => {
            const exhibitModel = self.exhibitManager.get(box.exhibit.id)
            if (exhibitModel) {
              const schema = exhibitModel.getSchema()
              box.exhibit = schema
            }
          })
        })
        const params = {
          ':projectId': projectId,
          ':artId': artId,
          dataManager,
          ...basic,
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
