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
import createLog from '@utils/create-log'

const log = createLog('@models/art/art-publish-info.js')

const PublishVersion = types.model('PublishVersion', {
  versionId: types.number,
  ctime: types.number,
  isOnline: types.boolean,
})

export const MPublishInfo = types
  .model('MPublishInfo', {
    publishId: types.string,
    projectId: types.number,
    artId: types.number,
    list: types.optional(types.array(PublishVersion), []),
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
    }

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

    const publish = flow(function* publish() {
      try {
        yield io.art.publish({
          ':artId': self.artId,
          ':projectId': self.projectId,
        })
        self.getVersions()
        self.toggleArtOnline(true)
      } catch (error) {
        log.error('publish Error: ', error)
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
      online,
      offline,
      remove,
      copyUrl,
      toggleArtOnline,
    }
  })
