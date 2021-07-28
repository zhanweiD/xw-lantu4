import {types} from "mobx-state-tree"
import commonAction from "@utils/common-action"

export const MDescription = types
  .model("MDescription", {
    name: types.optional(types.string, ""),
    description: types.optional(types.string, "")
  })
  .actions(commonAction(["set"]))
