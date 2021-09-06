import {types} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import isDef from "@utils/is-def"

export const MTextField = types
  .model("MTextField", {
    type: types.optional(types.enumeration(["text", "password"]), "text"),
    label: types.optional(types.string, ""),
    value: types.maybe(types.union(types.number, types.string)),
    defaultValue: types.maybe(types.union(types.number, types.string)),
    placeholder: types.optional(types.string, "")
  })
  .actions(commonAction(["set"]))
  .actions((self) => {
    const afterCreate = () => {
      if (!isDef(self.value)) {
        self.value = self.defaultValue
      }
    }
    const setValue = (value) => {
      self.value = value
    }
    const getValue = () => {
      return isDef(self.value) ? self.value : self.defaultValue
    }
    return {
      afterCreate,
      getValue,
      setValue
    }
  })
