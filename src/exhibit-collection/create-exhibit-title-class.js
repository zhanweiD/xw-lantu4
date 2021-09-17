import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import {transform} from './exhibit-config'

export const createTitleClass = (key, title) => {
  const {effective, sections, fields} = title
  const MTitle = types
    .model(`M${key}Title`, {
      normalKeys: types.frozen(['name', 'effective']),
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
  return MTitle.create()
}
