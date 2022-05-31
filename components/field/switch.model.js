import {types, getParent} from 'mobx-state-tree'
import {reaction} from 'mobx'
import isBoolean from 'lodash/isBoolean'
import createLog from '@utils/create-log'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import {commonFieldModelViews} from './base'

const log = createLog('@components/field/switch.model')

export const MSwitchField = types
  .model('MSwitchField', {
    section: types.optional(types.string, ''),
    type: types.enumeration(['switch']),
    label: types.optional(types.string, ''),
    tip: types.maybe(types.string),
    value: types.maybe(types.boolean),
    defaultValue: types.optional(types.boolean, false),
    readOnly: types.optional(types.boolean, false),
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
      if (isBoolean(value)) {
        self.value = value
      } else {
        log.warn(`Cannot set a '${typeof value}' value to switch field which label is '${self.label})'`, value)
        self.value = self.defaultValue
      }
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      // 只要是启用状态，就返回value值
      return self.whenIsSatisfied ? (isDef(self.value) ? self.value : self.defaultValue) : undefined
    }

    return {
      afterCreate,
      setValue,
      getValue,
    }
  })
