import {types, getParent} from 'mobx-state-tree'
import {reaction} from 'mobx'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import {commonFieldModelViews} from './base'

export const MColorField = types
  .model('MColorField', {
    section: types.optional(types.string, ''),
    type: types.enumeration(['color']),
    label: types.optional(types.string, ''),
    value: types.frozen(),
    defaultValue: types.frozen(),
    readOnly: types.optional(types.boolean, false),
    isColorArrayForm: types.optional(types.boolean, false),
    opacityMax: types.optional(types.number, 1),
    isFixed: types.optional(types.boolean, true),
    tip: types.maybe(types.string),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false),
    supportProcessor: types.optional(types.boolean, false),
    processorCode: types.maybe(types.string),
    useProcessor: types.optional(types.boolean, false),
    // 判断是否点击保存过processorCode
    hasSaveCode: types.optional(types.boolean, false),
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

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      if (self.supportProcessor) {
        return self.processorFunction
      }
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
