import {types} from 'mobx-state-tree'

import isNumber from 'lodash/isNumber'
import isNumeric from '@utils/is-numberic'
import fixRange from '@utils/fix-range'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

const MItem = types.model('MItem', {
  key: types.string,
  min: types.maybe(types.number),
  max: types.maybe(types.number),
  step: types.optional(types.number, 1),
})
export const MMultiNumberField = types
  .model('MMultiNumberField', {
    type: types.enumeration(['multiNumber']),
    option: types.optional(types.string, ''),

    label: types.optional(types.string, ''),
    inputValue: types.optional(types.array(types.union(types.number, types.string)), []),
    // ! union很重要，数字输入框输入过程中清空的时候，是空字符串
    value: types.optional(types.array(types.union(types.number, types.string)), []),
    defaultValue: types.optional(types.array(types.number), []),
    items: types.optional(types.array(MItem), []),
  })

  .actions(commonAction(['set']))
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
      // inputValue是纯前端逻辑字段
      self.inputValue = [...self.value]
    }

    const setValue = (value) => {
      self.inputValue = value
      let isAllNumeric = true
      const transformValue = self.inputValue.map((v) => {
        if (isNumeric(v)) {
          return fixRange(+v, self.min, self.max)
        }
        isAllNumeric = false
        return undefined
      })
      isAllNumeric && (self.value = transformValue)
    }

    const getValue = () => {
      return self.items.map((item, index) => {
        return !isDef(self.value.toJSON()[index]) && isNumber(self.defaultValue[index])
          ? self.defaultValue[index]
          : self.value[index]
      })
    }

    return {
      afterCreate,
      setValue,
      getValue,
    }
  })
