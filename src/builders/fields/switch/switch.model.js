import {types} from 'mobx-state-tree'
import isBoolean from 'lodash/isBoolean'
import createLog from '@utils/create-log'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'

const log = createLog('@components/field/switch.model')

export const MSwitchField = types
  .model('MSwitchField', {
    type: types.enumeration(['switch']),
    label: types.optional(types.string, ''),
    value: types.maybe(types.boolean),
    defaultValue: types.optional(types.boolean, false),
  })
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = self.defaultValue
      }
    }

    const setValue = (value) => {
      if (isBoolean(value)) {
        self.value = value
      } else {
        log.warn(`Cannot set a '${typeof value}' value to switch field which label is '${self.label})'`, value)
        self.value = self.defaultValue
      }
    }

    const getValue = () => {
      return isDef(self.value) ? self.value : self.defaultValue
    }

    return {
      afterCreate,
      setValue,
      getValue,
    }
  })
