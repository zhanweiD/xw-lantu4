import {types, getParent} from "mobx-state-tree"
import hJSON from "hjson"
import cloneDeep from "lodash/cloneDeep"
import commonAction from "@utils/common-action"
import isDef from "@utils/is-def"
import tip from "@components/tip"
import copy from "@utils/copy"

import {commonFieldModelViews} from "./base"

const MValue = types
  .model("MValue", {
    type: types.optional(types.enumeration(["private", "source"]), "private"),
    private: types.maybe(types.string),
    source: types.optional(types.array(types.number), []),
    sourceProcessor: types.optional(types.string, "")
  })
  .actions(commonAction(["set"]))

export const MDataField = types
  .model("MDataField", {
    section: types.optional(types.string, ""),
    type: types.enumeration(["data"]),
    label: types.optional(types.string, ""),
    value: types.maybe(MValue),
    defaultValue: types.optional(MValue, {})
  })
  .views((self) => commonFieldModelViews(self))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = cloneDeep(self.defaultValue.toJSON())
      }
    }

    const setValue = (value) => {
      self.value.set(value)
    }

    const copyJSON = () => {
      copy(self.value.private)
      tip.success({content: "复制成功"})
    }

    const formatJSON = () => {
      try {
        const json = hJSON.parse(self.value.private)
        self.value.set({
          private: hJSON.stringify(json, {space: 2, quotes: "strings", separator: true})
        })
      } catch (error) {
        tip.error({content: "格式化失败,请检查JSON是否合法"})
      }
    }

    const getValue = () => {
      return isDef(self.value) ? self.value : self.defaultValue
    }

    const saveValue = () => {
      try {
        hJSON.parse(self.value.private)
        getParent(self).update(self.fieldOption)
      } catch (error) {
        tip.error({content: "保存失败,请检查JSON是否合法"})
      }
    }

    return {
      afterCreate,
      copyJSON,
      formatJSON,
      setValue,
      getValue,
      saveValue
    }
  })
