import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import {transform} from './exhibit-config'

export const createLengedClass = (key, lenged) => {
  const {effective, sections, fields} = lenged
  const MLenged = types
    .model(`M${key}Lenged`, {
      normalKeys: types.frozen(['effective']),
      deepKeys: types.frozen(['options']),
    })
    .actions(commonAction(['set', 'getSchema', 'setSchema']))
    .actions((self) => {
      const afterCreate = () => {
        const MConfig = transform({sections, fields})
        if (isDef(effective)) {
          self.effective = effective
        }
        self.options = MConfig.create()
      }

      const toggleEffective = () => {
        self.effective = !self.effective
      }

      return {
        afterCreate,
        toggleEffective,
      }
    })
  return MLenged.create()
}
