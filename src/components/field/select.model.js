import {reaction} from "mobx"
import {types, getParent} from "mobx-state-tree"
import isDef from "@utils/is-def"
import commonAction from "@utils/common-action"
import {commonFieldModelViews} from "./base"

const MKeyValue = types.model("MKeyValue", {
  key: types.string,
  value: types.frozen(),
  thumbnail: types.maybe(types.string),
  remark: types.maybe(types.string),
  data: types.frozen()
})

export const MSelectField = types
  .model("MSelectField", {
    section: types.optional(types.string, ""),
    type: types.enumeration([
      "select",
      "selectFilter",
      "selectGradientColor",
      "selectWithThumbnail",
      "selectThemeColor"
    ]),
    label: types.optional(types.string, ""),
    value: types.frozen(),
    defaultValue: types.frozen(),
    options: types.optional(types.array(MKeyValue), []),
    readOnly: types.optional(types.boolean, false),
    menuPlacement: types.optional(types.string, "auto"),
    menuMaxBottomPadding: types.optional(types.number, 200),
    maxMenuHeight: types.optional(types.number, 200),
    isMulti: types.optional(types.boolean, false),
    isFixed: types.optional(types.boolean, false),
    hasRemark: types.optional(types.boolean, false),
    isCloseMenuOnScroll: types.optional(types.boolean, false),
    container: types.optional(types.string, ""),
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
          // 当打开第一个Tab的时候，才执行reaction函数，所以根据reaction的默
          // 认行为，只有打开第二个Tab才会开始执行响应函数，所以要改变默认行为
          // fireImmediately: true,
          delay: 300
        }
      )
    }

    const setOptions = (options) => {
      self.options = options
    }

    const setValue = (value) => {
      self.value = value || self.defaultValue
    }

    const clearValue = () => {
      self.value = undefined
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
      setOptions,
      setValue,
      clearValue,
      getValue
    }
  })
