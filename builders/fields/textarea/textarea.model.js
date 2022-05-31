import {types} from 'mobx-state-tree'
import MBase from '../base.model'

export const MTextareaField = MBase.named('MTextareaField').props({
  type: types.enumeration(['textarea']),
  option: types.optional(types.string, ''),
  effective: types.optional(types.boolean, true),
  value: types.maybe(types.string),
  defaultValue: types.optional(types.string, ''),
  placeholder: types.optional(types.string, ''),
})
