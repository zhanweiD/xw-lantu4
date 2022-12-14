import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import isNumber from 'lodash/isNumber'
import fixRange from '@utils/fix-range'
import isNumeric from '@utils/is-numberic'
import MBase from '../base.model'

export const MNumberField = MBase.named('MNumberField')
  .props({
    type: types.enumeration(['number']),
    option: types.optional(types.string, ''),
    effective: types.optional(types.boolean, true),
    inputValue: types.frozen(),
    value: types.maybe(types.number),
    defaultValue: types.optional(types.number, 0),
    min: types.maybe(types.number),
    max: types.maybe(types.number),
    step: types.optional(types.number, 1),
    hasSlider: types.optional(types.boolean, false),
    placeholder: types.optional(types.string, ''),
  })
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

    return {
      afterCreate,
      setValue,
    }
  })
