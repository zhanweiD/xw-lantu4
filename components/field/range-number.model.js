import {types, getParent} from 'mobx-state-tree'
import {reaction} from 'mobx'
import isNumber from 'lodash/isNumber'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import {commonFieldModelViews} from './base'

const MItem = types.model('MItem', {
  key: types.string,
  min: types.maybe(types.number),
  max: types.maybe(types.number),
  step: types.optional(types.number, 1),
})

// todo 滑动条
export const MRangeNumberField = types
  .model('MRangeNumberField', {
    section: types.optional(types.string, ''),
    type: types.enumeration(['rangeNumber']),
    label: types.optional(types.string, ''),
    // TODO 经验
    // !union很重要，数字输入框输入过程中清空的时候，是空字符串
    value: types.optional(types.array(types.union(types.number, types.string)), []),
    defaultValue: types.optional(types.array(types.number), []),
    items: types.optional(types.array(MItem), []),
    readOnly: types.optional(types.boolean, false),
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
            value: self.value,
            when: self.when,
          }
        },
        () => {
          getParent(self).update(self.fieldOption)
        },
        {
          // fireImmediately: true,
          delay: 300,
        }
      )
    }

    const setValue = (value) => {
      self.value = value
    }

    const clearValue = () => {
      self.value = []
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
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
