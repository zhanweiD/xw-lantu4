import {types, getParent} from "mobx-state-tree"
import {reaction} from "mobx"
import commonAction from "@utils/common-action"
import isDef from "@utils/is-def"
import isNumber from "lodash/isNumber"
import isNumeric from "@utils/is-numberic"
import {commonFieldModelViews} from "./base"

const fixRange = (n, min, max) => {
  if (isNumeric(min)) {
    n = n < min ? min : n
  }
  if (isNumeric(max)) {
    n = n > max ? max : n
  }
  return n
}

export const MNumberField = types
  .model("MNumberField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["number"]),
    label: types.optional(types.string, ""),
    inputValue: types.frozen(),
    value: types.maybe(types.number),
    defaultValue: types.maybe(types.union(types.number, types.string)),
    min: types.maybe(types.number),
    max: types.maybe(types.number),
    step: types.optional(types.number, 1),
    hasSlider: types.optional(types.boolean, false),
    readOnly: types.optional(types.boolean, false),
    tip: types.maybe(types.string),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false),
    supportProcessor: types.optional(types.boolean, false),
    processorCode: types.maybe(types.string),
    useProcessor: types.optional(types.boolean, false),
    // 判断是否点击保存过processorCode
    hasSaveCode: types.optional(types.boolean, false)
  })
  .views((self) => commonFieldModelViews(self))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value) && isNumber(self.defaultValue)) {
        self.value = self.defaultValue
      }
      reaction(
        () => {
          return {
            value: self.value,
            when: self.when
          }
        },
        () => {
          getParent(self).update(self.fieldOption)
        },
        {
          delay: 300
        }
      )
      // inputValue是纯前端逻辑字段，实例化模型的时候一定没有值
      self.inputValue = self.value
    }

    const setValue = (value) => {
      self.inputValue = value
      if (isNumeric(value)) {
        self.value = fixRange(+self.inputValue, self.min, self.max)
      }
    }

    const clearValue = () => {
      self.value = undefined
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      if (self.supportProcessor) {
        return self.processorFunction
      }
      // 只要是启用状态，就返回value值
      return self.whenIsSatisfied
        ? isDef(self.value)
          ? self.value
          : self.defaultValue
        : undefined
    }

    return {
      afterCreate,
      setValue,
      clearValue,
      getValue
    }
  })
