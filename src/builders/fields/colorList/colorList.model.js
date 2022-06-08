import {types} from 'mobx-state-tree'
import {colorArrayForm, colorObjectForm} from './gradient-util'
import isDef from '@utils/is-def'
import MBase from '../base.model'

export const MColorListField = MBase.named('MColorListField')
  .props({
    type: types.enumeration(['colorList']),
    option: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.optional(types.frozen(), [[['rgba(74,144,226,1)', 0]]]),
  })
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = self.defaultValue.map((item) => colorArrayForm(colorObjectForm(item)))
      } else {
        self.value = self.value.map((item) => colorArrayForm(colorObjectForm(item)))
      }
    }

    return {
      afterCreate,
    }
  })
