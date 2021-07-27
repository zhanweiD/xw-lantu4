import {types, getParent} from "mobx-state-tree"
import {reaction} from "mobx"
import isDef from "@utils/is-def"
import {globalEvent} from "@utils/create-event"
import commonAction from "@utils/common-action"
import {commonFieldModelViews} from "./base"

const MKeyValue = types.model("MKeyValue", {
  key: types.string,
  value: types.maybe(types.string),
  name: types.string
})

export const MImageField = types
  .model("MImageField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["image"]),
    label: types.optional(types.string, ""),
    value: types.maybe(types.string),
    defaultValue: types.optional(types.string, ""),
    options: types.optional(types.array(MKeyValue), []),
    opacity: types.optional(types.number, 1),
    readOnly: types.optional(types.boolean, false),
    tip: types.maybe(types.string),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false)
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
      globalEvent.on("selectImage", ({url}) => self.setValue(url))
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
