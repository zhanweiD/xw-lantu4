import {types, getParent} from 'mobx-state-tree'
import {reaction} from 'mobx'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import {commonFieldModelViews} from './base'

const MKeyValue = types.model('MKeyValue', {
  key: types.string,
  value: types.string,
})

export const MCheckField = types
  .model('MCheckField', {
    section: types.optional(types.string, ''),
    type: types.enumeration(['check']),
    label: types.optional(types.string, ''),
    value: types.maybe(types.string),
    defaultValue: types.optional(types.string, ''),
    options: types.optional(types.array(MKeyValue), []),
    readOnly: types.optional(types.boolean, false),
    disabledKey: types.optional(types.array(types.string), []),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false),
  })
  .views((self) => commonFieldModelViews(self))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = self.defaultValue
      }
      reaction(
        () => {
          return {
            value: self.value,
            when: self.when,
          }
        },
        () => {
          getParent(self).update(self.fieldOption)
        },
        {
          // fireImmediately: true,
          delay: 300,
        }
      )
    }

    const setValue = (value) => {
      self.value = value
    }

    const clearValue = () => {
      self.value = ''
    }

    const getValue = () => {
      // 只要是启用状态，就返回value值
      return self.whenIsSatisfied ? (isDef(self.value) ? self.value : self.defaultValue) : undefined
    }

    return {
      afterCreate,
      setValue,
      clearValue,
      getValue,
    }
  })
