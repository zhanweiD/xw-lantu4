import {types} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import isDef from '@utils/is-def'

export const MTextField = types
  .model('MTextField', {
    type: types.optional(types.enumeration(['text', 'password']), 'text'),
    option: types.optional(types.string, ''),
    effective: types.optional(types.boolean, true),
    label: types.optional(types.string, ''),
    value: types.maybe(types.string),
    defaultValue: types.optional(types.string, ''),
    placeholder: types.optional(types.string, ''),
  })
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = self.defaultValue
      }
    }
    const setValue = (value) => {
      self.value = value
    }
    const getValue = () => {
      return self.effective ? (isDef(self.value) ? self.value : self.defaultValue) : undefined
    }

    const setEffective = (b) => {
      self.effective = b
    }
    return {
      afterCreate,
      getValue,
      setValue,
      setEffective,
    }
  })
