import {types, getParent} from "mobx-state-tree"
import isDef from "@utils/is-def"
import {reaction} from "mobx"
import commonAction from "@utils/common-action"
import {commonFieldModelViews} from "./base"

export const MCodeField = types
  .model("MCodeField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["code"]),
    label: types.optional(types.string, ""),
    value: types.maybe(types.string),
    defaultValue: types.optional(types.string, ""),
    readOnly: types.optional(types.boolean, false),
    readOnlyCode: types.optional(types.boolean, false),
    buttons: types.frozen(),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false),
    height: types.optional(types.number, 300),
    mode: types.optional(types.string, "javascript")
  })
  .views((self) => commonFieldModelViews(self))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
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
          // fireImmediately: true,
          delay: 300
        }
      )
    }

    const setValue = (value) => {
      self.value = value
      if (!isDef(value)) {
        self.value = self.defaultValue
      }
    }

    const clearValue = () => {
      self.value = ""
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
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
