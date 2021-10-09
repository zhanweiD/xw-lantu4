import {types} from 'mobx-state-tree'
import hJSON from 'hjson'
import uuid from '@utils/uuid'
import {MDataField} from '@builders/data-section'
import commonAction from '@utils/common-action'
import {transform} from './exhibit-config'
import isDef from '@utils/is-def'

export const createLayer = (category, key, layer, env) => {
  const {name, type, id = uuid(), sections, fields} = layer
  const MLayer = types
    .model(`M${key}Layer`, {
      id: types.optional(types.string, id),
      type: types.optional(types.string, type),
      name: types.optional(types.string, name),
      // NOTE 装饰类组件还没有category，有undefined的情况，其实都应该有
      category: types.maybe(types.string, category),
      effective: types.optional(types.boolean, true),
      normalKeys: types.frozen(['id', 'type', 'name', 'effective', 'category']),
      deepKeys: types.frozen(['options', 'data']),
    })
    .actions(commonAction(['set', 'getSchema', 'setSchema']))
    .actions((self) => {
      const afterCreate = () => {
        // 需要判断是否是gis，如果是gis就把数据塞到每一层里去
        const MConfig = transform({id, sections, fields})
        self.options = MConfig.create()
        if (layer.data) {
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
        let data
        if (self.data) {
          const {type, private: privateData, source} = self.data.getSchema()
          if (type === 'private') {
            data = hJSON.parse(privateData)
          }
          if (type === 'source') {
            const {datas = []} = self.art_
            const sourceData = datas.find((v) => v.id === source)
            if (sourceData) {
              let value = []
              let result = sourceData.data
              if (sourceData.config.useDataProcessor) {
                result = makeFunction(sourceData.processorFunction)({data: sourceData.data})
              }

              switch (sourceData.dataType) {
                case 'json':
                  value = result
                  break
                case 'excel':
                  let head = result.columns.map((col) => col.name)
                  const list = result.data.map((res) => {
                    const target = []
                    head.map((col) => {
                      target.push(res[col])
                    })
                    return target
                  })
                  value = [].concat(head).concat(list)
                  break
                default:
                  value = result
              }
              data = value
            }
          }
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

export const createExhibitLayersClass = (category, key, layers, env) => {
  return layers.map((layer) => createLayer(category, key, layer, env))
}
