/*
 * @Author: 柿子
 * @Date: 2021-08-09 17:07:03
 * @LastEditTime: 2021-08-09 17:17:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/new-art/art-publish-info.js
 */

import {types, flow, getEnv} from 'mobx-state-tree'
import io from '@utils/io'
import copy from '@utils/copy'
import commonAction from '@utils/common-action'
import CryptoJS from 'crypto-js'
import encryptionType from '@utils/base64-decode'
import createLog from '@utils/create-log'

const log = createLog('@models/art/art-publish-info.js')

const PublishVersion = types.model('PublishVersion', {
  versionId: types.number,
  ctime: types.number,
  isOnline: types.boolean,
})

// 部署相关不该放在这，回头单独维护一个model
const exportList = types.model('exportList', {
  id: types.number,
  ctime: types.number,
  type: types.number,
  remark: types.string,
})

export const MPublishInfo = types
  .model('MPublishInfo', {
    publishId: types.string,
    projectId: types.number,
    artId: types.number,
    // publishType:types.string,
    // publishPassword:types.string,
    list: types.optional(types.array(PublishVersion), []),
    exportList: types.optional(types.array(exportList), []),
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const {tip} = self.env_
    const afterCreate = () => {
      self.getVersions()
      self.getExportList()
    }

    const getExportList = flow(function* getExportList() {
      try {
        const res = yield io.art.getExportList({
          ':artId': self.artId,
        })
        self.exportList = res
      } catch (error) {
        log.error('getExportList Error: ', error)
      }
    })
    const exportTag = flow(function* exportTag(remark) {
      try {
        yield io.art.exportTag({
          remark,
          publishId: self.publishId,
        })
        self.env_.tip.success({content: '导出成功'})
        self.getExportList()
      } catch (error) {
        log.error('exportTag Error: ', error)
      }
    })
    const exportDownload = (id) => {
      const a = document.createElement('a')
      const e = document.createEvent('MouseEvents')
      a.href = `/api/v4/waveview/art/${id}/download/waveview`
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
      self.env_.tip.success({content: '下载成功'})
    }

    const exportDelete = flow(function* exportDelete(id) {
      try {
        yield io.art.exportDelete({
          ':id': id,
        })
        self.env_.tip.success({content: '删除成功'})
        self.getExportList()
      } catch (error) {
        log.error('getVersions Error: ', error)
      }
    })

    const getVersions = flow(function* getVersions() {
      try {
        const {list} = yield io.art.getPublishVersions({
          ':artId': self.artId,
        })
        self.list = list
      } catch (error) {
        log.error('getVersions Error: ', error)
      }
    })

    const passwordPublish = flow(function* passwordPublish(isPrivate) {
      const params = isPrivate ? {value: CryptoJS.AES.encrypt(self.publishPassword, encryptionType).toString()} : {}
      try {
        yield io.art.passwordPublish({
          ':artId': self.artId,
          ':projectId': self.projectId,
          password: {
            type: isPrivate ? 'private' : 'overt',
            ...params,
          },
        })
      } catch (error) {
        log.error('passwordPublish Error: ', error)
      }
    })

    const publish = flow(function* publish(isPrivate) {
      try {
        self.passwordPublish(isPrivate)
        yield io.art.publish({
          ':artId': self.artId,
          ':projectId': self.projectId,
        })
        self.getVersions()
        self.toggleArtOnline(true)
      } catch (error) {
        tip.error({content: error.message})
        log.error('publish Error: ', error)
        self.getVersions()
        self.toggleArtOnline(true)
      }
    })

    const online = flow(function* online(versionId) {
      try {
        yield io.art.updateVersionStatus({
          ':projectId': self.projectId,
          ':artId': self.artId,
          ':versionId': versionId,
          ':action': 'publish',
        })
        self.getVersions()
        self.toggleArtOnline(true)
      } catch (error) {
        tip.error({content: error.message})
        log.error('online Error: ', error)
      }
    })

    const offline = flow(function* offline(versionId) {
      try {
        yield io.art.updateVersionStatus({
          ':projectId': self.projectId,
          ':artId': self.artId,
          ':versionId': versionId,
          ':action': 'unPublish',
        })
        self.getVersions()
        self.toggleArtOnline(false)
      } catch (error) {
        tip.error({content: error.message})
        log.error('offline Error: ', error)
      }
    })

    const remove = flow(function* remve(versionId) {
      try {
        yield io.art.removeVersion({
          ':projectId': self.projectId,
          ':artId': self.artId,
          ':versionId': versionId,
        })
        self.getVersions()
      } catch (error) {
        log.error('remove Error: ', error)
      }
    })

    const copyUrl = (path) => {
      copy(path)
      self.env_.tip.success({content: '复制成功'})
    }

    const toggleArtOnline = (isOnline) => {
      const {event} = self.env_
      event.fire('project-panel.updateArt', {
        projectId: self.projectId,
        artId: self.artId,
        publishId: self.publishId,
        isOnline,
      })
    }

    return {
      afterCreate,
      getVersions,
      publish,
      passwordPublish,
      online,
      offline,
      remove,
      copyUrl,
      toggleArtOnline,
      exportTag,
      getExportList,
      exportDownload,
      exportDelete,
    }
  })
