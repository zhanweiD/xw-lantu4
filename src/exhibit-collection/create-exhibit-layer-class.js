import {types, getRoot} from 'mobx-state-tree'
import uuid from '@utils/uuid'
import commonAction from '@utils/common-action'
import {transform} from './exhibit-config'
import {MDataField} from '../builders/data-section'

export const createLayer = (key, layer, env) => {
  const {name, type, id = uuid(), sections} = layer
  const MLayer = types
    .model(`M${key}Layer`, {
      id: types.optional(types.string, id),
      type: types.optional(types.string, type),
      name: types.optional(types.string, name),
      normalKeys: types.frozen(['id', 'type', 'name']),
      deepKeys: types.frozen(['options', 'data']),
    })
    .actions(commonAction(['set', 'getSchema', 'setSchema']))
    .actions((self) => {
      const afterCreate = () => {
        // 需要判断是否是gis，如果是gis就把数据塞到每一层里去
        const MConfig = transform({id, sections})
        self.options = MConfig.create()
        self.data = MDataField.create(
          {
            type: 'data',
            relationModels: self.options.getRelationFields('columnSelect'),
          },
          {
            ...env,
          }
        )
      }
      return {
        afterCreate,
      }
    })
  return MLayer.create(layer)
}

export const createExhibitLayersClass = (key, layers, env) => {
  return layers.map((layer) => createLayer(key, layer, env))
}
