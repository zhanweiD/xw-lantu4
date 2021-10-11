import {types} from 'mobx-state-tree'
import MBase from '../base.model'

export const MCodeField = MBase.named('MCodeField').props({
  type: types.enumeration(['code']),
  option: types.optional(types.string, ''),
  value: types.maybe(types.string),
  defaultValue: types.optional(types.string, ''),
  buttons: types.frozen(),
  height: types.optional(types.number, 300),
  mode: types.optional(types.string, 'javascript'),
})
