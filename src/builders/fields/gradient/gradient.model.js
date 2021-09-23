import {types} from 'mobx-state-tree'
import commonAction from '@utils/common-action'

import isDef from '@utils/is-def'

export const MGradientField = types
  .model('MGradientField', {
    type: types.enumeration(['gradient']),
    option: types.optional(types.string, ''),

    label: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.optional(types.frozen(), ['rgb(74,144,226)', 'rgb(80,227,194)']),
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
      return self.value
    }

    return {
      afterCreate,
      setValue,
      getValue,
    }
  })
