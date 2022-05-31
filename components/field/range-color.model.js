import {types, getParent, getRoot} from 'mobx-state-tree'
import {reaction} from 'mobx'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import {commonFieldModelViews} from './base'

const MItem = types.model('MItem', {
  key: types.string,
})

export const MRangeColorField = types
  .model('MRangeColorField', {
    section: types.optional(types.string, ''),
    type: types.enumeration(['rangeColor']),
    label: types.optional(types.string, ''),
    value: types.optional(types.array(types.string), []),
    defaultValue: types.optional(types.array(types.string), []),
    items: types.optional(types.array(MItem), []),
    readOnly: types.optional(types.boolean, false),
    tip: types.maybe(types.string),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get themeColor() {
      // 获取到根节点中context里面的themeColors
      return getRoot(self).context.themeColors
    },
  }))
  .views((self) => commonFieldModelViews(self))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (self.items.length !== self.defaultValue.length) {
        throw new Error('defaultValue value need the same length as items.')
      }
      // value值为数组，元素赋值
      self.items.forEach((item, index) => {
        if (!isDef(self.value.toJSON()[index])) {
          self.value[index] = self.defaultValue[index]
        }
      })
      reaction(
        () => {
          return {
            value: self.value.toJSON(),
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
      self.value = []
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      // pro field2
      if (self.supportProcessor2 && self.hasSaveCode) {
        return self.processorFunction
      }
      return self.whenIsSatisfied
        ? self.items.map((item, index) => {
            return !isDef(self.value.toJSON()[index]) ? self.defaultValue[index] : self.value[index]
          })
        : undefined
    }

    return {
      afterCreate,
      setValue,
      clearValue,
      getValue,
    }
  })
