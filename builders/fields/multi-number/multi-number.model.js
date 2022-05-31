import {types} from 'mobx-state-tree'
import isNumber from 'lodash/isNumber'
import isDef from '@utils/is-def'
import MBase from '../base.model'

const MItem = types.model('MItem', {
  key: types.string,
  min: types.maybe(types.number),
  max: types.maybe(types.number),
  step: types.optional(types.number, 1),
})
export const MMultiNumberField = MBase.named('MMultiNumberField')
  .props({
    type: types.enumeration(['multiNumber']),
    option: types.optional(types.string, ''),
    value: types.optional(types.array(types.union(types.number, types.string)), []),
    defaultValue: types.optional(types.array(types.number), []),
    items: types.optional(types.array(MItem), []),
  })
  .actions((self) => {
    const afterCreate = () => {
      if (self.items.length !== self.defaultValue.length) {
        throw new Error('defaultValue value need the same length as items.')
      }
      self.items.forEach((item, index) => {
        if (!isDef(self.value.toJSON()[index]) && isNumber(self.defaultValue[index])) {
          self.value[index] = self.defaultValue[index]
        }
      })
    }

    const getValue = () => {
      return self.effective
        ? self.items.map((item, index) => {
            return !isDef(self.value.toJSON()[index]) && isNumber(self.defaultValue[index])
              ? self.defaultValue[index]
              : self.value[index]
          })
        : undefined
    }

    return {
      afterCreate,
      getValue,
    }
  })
