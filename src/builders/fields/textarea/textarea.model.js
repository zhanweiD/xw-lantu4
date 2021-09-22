import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

export const MTextareaField = types
  .model('MTextareaField', {
    type: types.enumeration(['textarea']),
    option: types.optional(types.string, ''),

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
      return isDef(self.value) ? self.value : self.defaultValue
    }

    return {
      afterCreate,
      setValue,
      getValue,
    }
  })
