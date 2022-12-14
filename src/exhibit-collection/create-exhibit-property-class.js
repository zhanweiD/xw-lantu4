import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import getObjectData from '@utils/get-object-data'
import {transform} from './exhibit-config'

export const createPropertyModel = (key, config, name = 'property') => {
  const {effective, sections, fields} = config
  const MModel = types
    .model(`M${key}.${name}`, {
      name: name,
      normalKeys: types.frozen(['effective']),
      deepKeys: types.frozen(['options']),
    })
    .actions(commonAction(['set', 'getSchema', 'setSchema']))
    .actions((self) => {
      const afterCreate = () => {
        const MConfig = transform({name, sections, fields})
        if (isDef(effective)) {
          self.effective = effective
        }
        self.options = MConfig.create()
      }

      const toggleEffective = () => {
        self.effective = !self.effective
      }
      const getData = () => {
        let values = {}
        const {options, effective} = self.getSchema()
        if (isDef(effective)) {
          values.effective = effective
        }

        if (!isDef(effective) || effective) {
          values = {
            ...values,
            ...getObjectData(options),
          }
        }
        return values
      }

      return {
        afterCreate,
        toggleEffective,
        getData,
      }
    })
  return MModel
}

export const createPropertyClass = (key, config, name) => {
  const MModel = createPropertyModel(key, config, name)
  return MModel.create()
}
