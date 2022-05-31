/*
 * @Author: 柿子
 * @Date: 2021-07-29 16:31:35
 * @LastEditTime: 2021-07-29 16:46:12
 * @LastEditors: Please set LastEditors
 * @Description: 数据屏使用的数据id及其映射组件关系的模型
 * @FilePath: /waveview-front4/src/models/new-art/art-data-manager.js
 */
import {types, getParent} from 'mobx-state-tree'
import {createManagerModel} from '@utils/create-manager-model'
import commonAction from '@utils/common-action'

const MData = types
  .model('MManagerByArt', {
    id: types.maybe(types.number),
    usedByExhibits: types.optional(types.array(types.string), []),
    normalKeys: types.frozen(['id', 'usedByExhibits']),
  })
  .actions(commonAction(['getSchema', 'setSchema']))
  .actions((self) => {
    const removeExhibit = (id) => {
      self.usedByExhibits = self.usedByExhibits.filter((v) => v !== id)
      if (self.usedByExhibits.length === 0) {
        const manager = getParent(self, 2)
        manager.remove(self.id)
      }
    }
    const addExhibit = (id) => {
      if (!self.usedByExhibits.find((v) => v === id)) {
        self.usedByExhibits.push(id)
      }
    }
    return {
      addExhibit,
      removeExhibit,
    }
  })

export const MDataManager = createManagerModel('MDataManager', MData)

const MMaterial = types
  .model('MMaterialByArt', {
    id: types.maybe(types.string),
    used: types.optional(types.array(types.number), []),
    normalKeys: types.frozen(['id', 'used']),
  })
  .actions(commonAction(['getSchema', 'setSchema']))
  .actions((self) => {
    const remove = (id) => {
      self.used = self.used.filter((v) => v !== id)
      if (self.used.length === 0) {
        const manager = getParent(self, 2)
        manager.remove(self.id)
      }
    }
    const add = (id) => {
      if (!self.used.find((v) => v === id)) {
        self.used.push(id)
      }
    }
    return {
      add,
      remove,
    }
  })

export const MMaterialManager = createManagerModel('MMaterialManager', MMaterial)
