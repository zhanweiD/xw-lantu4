import {types} from 'mobx-state-tree'
import MBase from '../base.model'

const MKeyValue = types.model('MKeyValue', {
  key: types.maybe(types.string),
  icon: types.maybe(types.string),
  value: types.union(types.string, types.number),
})

export const MCheckField = MBase.named('MCheckField').props({
  type: types.enumeration(['check']),
  option: types.optional(types.string, ''),
  value: types.maybe(types.union(types.string, types.number)),
  defaultValue: types.optional(types.union(types.string, types.number), ''),
  options: types.optional(types.array(MKeyValue), []),
})
