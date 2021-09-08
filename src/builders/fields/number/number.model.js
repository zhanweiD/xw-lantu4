import {types} from 'mobx-state-tree'
import commonAction from '@utils/common-action'
import isDef from '@utils/is-def'
import isNumber from 'lodash/isNumber'
import fixRange from '@utils/fix-range'
import isNumeric from '@utils/is-numberic'

export const MNumberField = types
  .model('MNumberField', {
    type: types.enumeration(['number']),
    label: types.optional(types.string, ''),
    inputValue: types.frozen(),
    value: types.maybe(types.number),
    defaultValue: types.maybe(types.union(types.number, types.string)),
    min: types.maybe(types.number),
    max: types.maybe(types.number),
    step: types.optional(types.number, 1),
    hasSlider: types.optional(types.boolean, false),
    placeholder: types.optional(types.string, ''),
  })
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value) && isNumber(self.defaultValue)) {
        self.value = self.defaultValue
      }

      // inputValue是纯前端逻辑字段，实例化模型的时候一定没有值
      self.inputValue = self.value
    }

    const setValue = (value) => {
      self.inputValue = value
      if (isNumeric(value)) {
        self.value = fixRange(+self.inputValue, self.min, self.max)
      }
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      return isDef(self.value) ? self.value : self.defaultValue
    }

    return {
      afterCreate,
      setValue,
      getValue,
    }
  })
