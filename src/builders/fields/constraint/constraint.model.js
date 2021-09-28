import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

const MValue = types.model('MValue', {
  top: types.optional(types.boolean, true),
  left: types.optional(types.boolean, true),
  bottom: types.optional(types.boolean, false),
  right: types.optional(types.boolean, false),
  height: types.optional(types.boolean, true),
  width: types.optional(types.boolean, true),
})

export const MConstraintField = types
  .model('MConstraintField', {
    type: types.enumeration(['constraint']),
    label: types.optional(types.string, ''),
    value: types.optional(MValue, {}),
    defaultValue: types.optional(MValue, {}),
  })
  .views((self) => ({
    get canCheckLine_() {
      let value = []
      if (['top', 'height', 'bottom'].filter((v) => self.value[v]).length < 2) {
        value.push(...['top', 'height', 'bottom'])
      } else {
        value.push(...['top', 'height', 'bottom'].filter((v) => self.value[v]))
      }
      if (['left', 'width', 'right'].filter((v) => self.value[v]).length < 2) {
        value.push(...['left', 'width', 'right'])
      } else {
        value.push(...['left', 'width', 'right'].filter((v) => self.value[v]))
      }
      return value
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
