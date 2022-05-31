import {types, getParent} from 'mobx-state-tree'
import {reaction} from 'mobx'
import isNumber from 'lodash/isNumber'
import isNumeric from '@utils/is-numberic'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import {commonFieldModelViews} from './base'

const MItem = types.model('MItem', {
  key: types.string,
  min: types.maybe(types.number),
  max: types.maybe(types.number),
  step: types.optional(types.number, 1),
})

const fixRange = (n, min, max) => {
  if (isNumeric(min)) {
    n = n < min ? min : n
  }
  if (isNumeric(max)) {
    n = n > max ? max : n
  }
  return n
}

export const MMultiNumberField = types
  .model('MMultiNumberField', {
    section: types.optional(types.string, ''),
    type: types.enumeration(['multiNumber']),
    label: types.optional(types.string, ''),
    inputValue: types.optional(types.array(types.union(types.number, types.string)), []),
    // * 经验
    // ! union很重要，数字输入框输入过程中清空的时候，是空字符串
    value: types.optional(types.array(types.union(types.number, types.string)), []),
    defaultValue: types.optional(types.array(types.number), []),
    items: types.optional(types.array(MItem), []),
    readOnly: types.optional(types.boolean, false),
    tip: types.maybe(types.string),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false),
  })
  .views((self) => commonFieldModelViews(self))
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
      reaction(
        () => {
          return {
            value: self.value.toJSON(),
            when: self.when,
          }
        },
        () => {
          getParent(self).update(self.fieldOption)
        },
        {
          delay: 300,
        }
      )
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

    const clearValue = () => {
      self.value = []
    }

    // ! 所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      // 只要是启用状态，就返回value值 self.defaultValue.toJSON()
      return self.whenIsSatisfied
        ? self.items.map((item, index) => {
            return !isDef(self.value.toJSON()[index]) && isNumber(self.defaultValue[index])
              ? self.defaultValue[index]
              : self.value[index]
          })
        : undefined
    }

    return {
      afterCreate,
      setValue,
      clearValue,
      getValue,
    }
  })
