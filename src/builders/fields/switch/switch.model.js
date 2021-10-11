import {types} from 'mobx-state-tree'
import isBoolean from 'lodash/isBoolean'
import createLog from '@utils/create-log'
import MBase from '../base.model'

const log = createLog('@components/field/switch.model')

export const MSwitchField = MBase.named('MSwitchField')
  .props({
    type: types.enumeration(['switch']),
    option: types.optional(types.string, ''),
    value: types.maybe(types.boolean),
    defaultValue: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const setValue = (value) => {
      if (isBoolean(value)) {
        self.value = value
      } else {
        log.warn(`Cannot set a '${typeof value}' value to switch field which label is '${self.label})'`, value)
        self.value = self.defaultValue
      }
    }

    return {
      setValue,
    }
  })
