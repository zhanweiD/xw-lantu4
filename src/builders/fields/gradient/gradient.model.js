import {types} from 'mobx-state-tree'
import {colorArrayForm, colorObjectForm} from './gradient-util'
import isDef from '@utils/is-def'
import MBase from '../base.model'

export const MGradientField = MBase.named('MGradientField')
  .props({
    type: types.enumeration(['gradient']),
    option: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.optional(types.frozen(), ['rgb(74,144,226)', 'rgb(80,227,194)']),
  })
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = colorArrayForm(colorObjectForm(self.defaultValue))
      } else {
        self.value = colorArrayForm(colorObjectForm(self.value))
      }
    }

    return {
      afterCreate,
    }
  })
