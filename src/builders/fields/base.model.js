import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

const MBase = types
  .model({
    // NOTE effective和visible是不一样的：
    // NOTE effective为false时，getValue永远返回undefined
    // NOTE visible的值，不影响getValue的返回值，仅在值为false时UI不展示
    // NOTE effective有对应的setEffective方法，visible值
    effective: types.optional(types.boolean, true),
    visible: types.optional(types.boolean, true),
    label: types.optional(types.string, ''),
    // NOTE 需要子类模型自定义value和defaultValue
  })
  .views((self) => ({
    get visible_() {
      return self.visible === false || self.effective === false ? false : true
    },
  }))
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
      return self.effective ? (isDef(self.value) ? self.value : self.defaultValue) : undefined
    }

    const setEffective = (b) => {
      self.effective = b
    }

    return {
      afterCreate,
      setValue,
      getValue,
      setEffective,
    }
  })

export default MBase
