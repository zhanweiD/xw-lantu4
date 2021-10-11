import {types} from 'mobx-state-tree'
import MBase from '../base.model'

const MValue = types.model('MValue', {
  top: types.optional(types.boolean, true),
  left: types.optional(types.boolean, true),
  bottom: types.optional(types.boolean, false),
  right: types.optional(types.boolean, false),
  height: types.optional(types.boolean, true),
  width: types.optional(types.boolean, true),
})

export const MConstraintField = MBase.named('MConstraintField')
  .props({
    type: types.enumeration(['constraint']),
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
