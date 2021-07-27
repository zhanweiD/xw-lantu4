import {types, getParent} from "mobx-state-tree"
import {reaction} from "mobx"
import isDef from "@utils/is-def"
import commonAction from "@utils/common-action"
import {commonFieldModelViews} from "./base"

export const MConstraintsField = types
  .model("MConstraintsField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["constraints"]),
    label: types.optional(types.string, ""),
    value: types.optional(types.array(types.boolean), []),
    defaultValue: types.optional(types.array(types.boolean), []),
    readOnly: types.optional(types.boolean, false),
    tip: types.maybe(types.string),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false)
  })
  .views((self) => commonFieldModelViews(self))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      // value值为数组，元素赋值
      Array.from({length: 6}).forEach((v, index) => {
        if (
          !isDef(self.value.toJSON()[index]) &&
          isDef(self.defaultValue.toJSON()[index])
        ) {
          self.value[index] = self.defaultValue[index]
        }
      })
      reaction(
        () => {
          return {
            value: self.value.toJSON(),
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
    }

    const clearValue = () => {
      self.value = ""
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      // 只要是启用状态，就返回value值
      return self.whenIsSatisfied
        ? self.value.toJSON().length === 6
          ? self.value.toJSON()
          : self.defaultValue.toJSON()
        : undefined
    }

    return {
      afterCreate,
      setValue,
      clearValue,
      getValue
    }
  })
