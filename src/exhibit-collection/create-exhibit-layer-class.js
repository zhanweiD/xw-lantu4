import {types, hasParent} from 'mobx-state-tree'
import hJSON from 'hjson'
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
      effective: types.optional(types.boolean, true),
      normalKeys: types.frozen(['id', 'type', 'name', 'effective']),
      deepKeys: types.frozen(['options', 'data']),
    })
    .actions(commonAction(['set', 'getSchema', 'setSchema']))
    .actions((self) => {
      const afterCreate = () => {
        // 需要判断是否是gis，如果是gis就把数据塞到每一层里去
        const MConfig = transform({id, sections})
        self.options = MConfig.create()
        if (key !== 'demo') {
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
      }

      const getData = () => {
        const {type, private: privateData} = self.data.getSchema()
        let data
        if (type === 'private') {
          data = hJSON.parse(privateData)
        }
        return data
      }

      const toggleEffective = () => {
        self.effective = !self.effective
      }

      return {
        afterCreate,
        getData,
        toggleEffective,
      }
    })
  return MLayer.create(layer)
}

export const createExhibitLayersClass = (key, layers, env) => {
  return layers.map((layer) => createLayer(key, layer, env))
}
