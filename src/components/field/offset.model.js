import {types, getParent} from "mobx-state-tree"
import {reaction} from "mobx"
import commonAction from "@utils/common-action"
import {commonFieldModelViews} from "./base"

const MKeyValue = types.model("MKeyValue", {
  margin: types.optional(types.array(types.number), []),
  padding: types.optional(types.array(types.number), [])
})

export const MOffsetField = types
  .model("MOffsetField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["offset"]),
    label: types.optional(types.string, ""),
    value: types.optional(MKeyValue, {}),
    defaultValue: types.optional(MKeyValue, {}),
    readOnly: types.optional(types.boolean, false),
    tip: types.maybe(types.string),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false)
  })
  .views((self) => commonFieldModelViews(self))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      if (Object.keys(self.defaultValue).length > 0) {
        Object.entries(self.defaultValue.toJSON()).forEach(([key, value]) => {
          self.value[key] = value
        })
      }
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
        ? Object.keys(self.value).length > 0
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
