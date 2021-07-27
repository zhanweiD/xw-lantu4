import {types, getParent} from "mobx-state-tree"
import {reaction} from "mobx"
import commonAction from "@utils/common-action"
import isDef from "@utils/is-def"
import {commonFieldModelViews} from "./base"

export const MTextField = types
  .model("MTextField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["text", "password"]),
    label: types.optional(types.string, ""),
    value: types.maybe(types.string),
    defaultValue: types.optional(types.string, ""),
    readOnly: types.optional(types.boolean, false),
    when: types.frozen(),
    tip: types.maybe(types.string),
    useReaction: types.optional(types.boolean, false),
    placeholder: types.optional(types.string, ""),
    valid: types.maybe(types.string)
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
          delay: 300
        }
      )
    }

    const setValue = (value) => {
      self.value = value
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
