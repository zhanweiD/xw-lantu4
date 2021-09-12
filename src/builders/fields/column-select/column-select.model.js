import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

const MKeyValue = types.model('MKeyValue', {
  key: types.string,
  value: types.frozen(),
  thumbnail: types.maybe(types.string),
  remark: types.maybe(types.string),
  data: types.frozen(),
})

export const MColumnSelectField = types
  .model('MColumnSelectField', {
    type: types.enumeration(['columnSelect']),
    label: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.frozen(),
    options: types.optional(types.array(MKeyValue), []),
  })
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = self.defaultValue
      }
    }

    const setOptions = (options) => {
      self.options = options
    }

    const setValue = (value) => {
      self.value = value || self.defaultValue
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      // 只要是启用状态，就返回value值
      return isDef(self.value) ? self.value : self.defaultValue
    }

    return {
      afterCreate,
      setOptions,
      setValue,
      getValue,
    }
  })
