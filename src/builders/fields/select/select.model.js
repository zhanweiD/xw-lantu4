import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

const MKeyValue = types.model('MKeyValue', {
  key: types.string,
  value: types.frozen(),
})

export const MSelectField = types
  .model('MSelectField', {
    type: types.enumeration(['select']),
    option: types.optional(types.string, ''),
    effective: types.optional(types.boolean, true),
    label: types.optional(types.string, ''),
    value: types.maybe(types.union(types.number, types.string)),
    defaultValue: types.maybe(types.union(types.number, types.string)),
    options: types.optional(types.array(MKeyValue), []),
  })
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = self.defaultValue
      }
    }

    const setValue = (value) => {
      self.value = value || self.defaultValue
    }

    const getValue = () => {
      return self.effective ? (isDef(self.value) ? self.value : self.defaultValue) : undefined
    }

    const setEffective = (b) => {
      self.effective = b
    }

    return {
      afterCreate,
      setValue,
      getValue,
      setEffective,
    }
  })
