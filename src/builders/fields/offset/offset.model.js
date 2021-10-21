import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import isNumber from 'lodash/isNumber'
import MBase from '../base.model'

const MItem = types.model('MItem', {
  key: types.string,
  min: types.maybe(types.number),
  max: types.maybe(types.number),
  step: types.optional(types.number, 1),
})

export const MOffsetField = MBase.named('MOffsetField')
  .props({
    type: types.enumeration(['offset']),
    option: types.optional(types.string, ''),
    effective: types.optional(types.boolean, true),
    items: types.optional(types.array(MItem), [
      {
        key: 'top',
        step: 1,
      },
      {
        key: 'right',
        step: 1,
      },
      {
        key: 'bottom',
        step: 1,
      },
      {
        key: 'left',
        step: 1,
      },
    ]),
    value: types.optional(types.array(types.union(types.number, types.string)), []),
    defaultValue: types.optional(types.array(types.number), [0, 0, 0, 0]),
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
