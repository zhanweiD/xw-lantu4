import {types} from 'mobx-state-tree'
import hJSON from 'hjson'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

const MKeyValue = types.model('MKeyValue', {
  key: types.string,
  value: types.frozen(),
})

export const MColumnSelectField = types
  .model('MColumnSelectField', {
    type: types.enumeration(['columnSelect']),
    option: types.optional(types.string, ''),

    label: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.frozen(),
    options: types.optional(types.array(MKeyValue), []),
  })
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = self.defaultValue
      }
    }

    const setOptions = (options) => {
      self.options = options
    }

    const setValue = (value) => {
      self.value = value
    }

    const getValue = () => {
      return isDef(self.value) ? self.value : self.defaultValue
    }

    const update = (table) => {
      const options = hJSON.parse(table)[0]?.map((v) => ({
        key: `${v}`,
        value: v,
      }))

      self.setOptions(options)
    }

    return {
      afterCreate,
      setOptions,
      setValue,
      getValue,
      update,
    }
  })
