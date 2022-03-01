import {types} from 'mobx-state-tree'
import MBase from '../base.model'

export const MTextField = MBase.named('MTextField').props({
  type: types.optional(types.enumeration(['text', 'password']), 'text'),
  option: types.optional(types.string, ''),
  effective: types.optional(types.boolean, true),
  value: types.maybe(types.string),
  defaultValue: types.optional(types.string, ''),
  // placeholder: types.optional(types.string, 'please input'),
  placeholder: types.optional(types.string, '请输入'),
})
