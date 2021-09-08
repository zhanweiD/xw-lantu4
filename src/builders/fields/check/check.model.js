import {types} from 'mobx-state-tree'

import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

const MKeyValue = types.model('MKeyValue', {
  key: types.maybe(types.string),
  icon: types.maybe(types.string),
  value: types.string,
})

export const MCheckField = types
  .model('MCheckField', {
    type: types.enumeration(['check']),
    label: types.optional(types.string, ''),
    value: types.maybe(types.union(types.string, types.number)),
    defaultValue: types.optional(types.string, ''),
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
      self.value = value
    }

    const getValue = () => {
      // 只要是启用状态，就返回value值
      return isDef(self.value) ? self.value : self.defaultValue
    }

    return {
      afterCreate,
      setValue,
      getValue,
    }
  })
