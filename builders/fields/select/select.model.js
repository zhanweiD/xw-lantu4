import {types} from 'mobx-state-tree'
import MBase from '../base.model'

const MKeyValue = types.model('MKeyValue', {
  key: types.string,
  value: types.frozen(),
})

export const MSelectField = MBase.named('MSelectField').props({
  type: types.enumeration(['select']),
  option: types.optional(types.string, ''),
  effective: types.optional(types.boolean, true),
  value: types.maybe(types.union(types.number, types.string)),
  defaultValue: types.maybe(types.union(types.number, types.string)),
  options: types.optional(types.array(MKeyValue), []),
})
