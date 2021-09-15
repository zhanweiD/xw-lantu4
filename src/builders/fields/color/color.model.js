import {types} from 'mobx-state-tree'

import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

export const MColorField = types
  .model('MColorField', {
    type: types.enumeration(['color']),
    // option -返回此field值时所用的key 返回值: {[self.option]: self.value}
    option: types.optional(types.string, 'option'),
    label: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.frozen(),
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
