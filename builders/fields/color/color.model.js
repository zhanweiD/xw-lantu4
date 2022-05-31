import {types} from 'mobx-state-tree'
import MBase from '../base.model'

export const MColorField = MBase.named('MColorField').props({
  type: types.enumeration(['color']),
  option: types.optional(types.string, ''),
  value: types.frozen(),
  defaultValue: types.frozen(),
})
