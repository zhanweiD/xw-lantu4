import {types, getParent} from "mobx-state-tree"
import {reaction} from "mobx"
import isDef from "@utils/is-def"
import commonAction from "@utils/common-action"
import {commonFieldModelViews} from "./base"

export const MSectionConfigField = types
  .model("MSectionConfigField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["sectionConfig"]),
    option: types.maybe(types.string),
    sectionOption: types.maybe(types.string),
    icon: types.optional(types.string, ""),
    value: types.optional(types.boolean, true),
    defaultValue: types.optional(types.boolean, true),
    readOnly: types.optional(types.boolean, false),
    action: types.maybe(types.string),
    when: types.frozen(),
    useReaction: types.optional(types.boolean, false)
  })
  .views((self) => commonFieldModelViews(self))
  .views((self) => ({
    get config() {
      const {sectionOption, option, value} = self
      if (sectionOption) {
        return {
          [option]: value
        }
      }
      return value
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      self.value = self.defaultValue

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
    }

    // !所有field的取值都应该使用getValue方法，整合了when的逻辑
    const getValue = () => {
      // 只要是启用状态，就返回value值
      return self.whenIsSatisfied
        ? isDef(self.config)
          ? self.config
          : self.defaultValue
        : undefined
    }

    return {
      afterCreate,
      setValue,
      getValue
    }
  })
