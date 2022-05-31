import {types} from 'mobx-state-tree'
import MBase from '../base.model'

export const MEchartsField = MBase.named('MEchartsField').props({
  type: types.optional(types.enumeration(['echartsoption']), 'echartsoption'),
  option: types.optional(types.string, ''),
  effective: types.optional(types.boolean, true),
  // value: types.maybe(types.string),
  value: types.frozen(),
  defaultValue: types.frozen(),
})
// effective: types.optional(types.boolean, true),
