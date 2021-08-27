import {types, getParent} from "mobx-state-tree"
import cloneDeep from "lodash/cloneDeep"
import {reaction} from "mobx"
import commonAction from "@utils/common-action"
import isDef from "@utils/is-def"

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
      reaction(
        () => {
          return {
            value: self.value.toJSON()
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
      self.value.set(value)
    }

    const getValue = () => {
      return isDef(self.value) ? self.value.toJSON() : self.defaultValue.toJSON()
    }

    return {
      afterCreate,
      setValue,
      getValue
    }
  })
