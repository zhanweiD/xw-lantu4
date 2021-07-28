import commonAction from "@utils/common-action"
import {types} from "mobx-state-tree"

export const MConstraints = types
  .model("MConstraints", {
    left: types.optional(types.boolean, true),
    top: types.optional(types.boolean, true),
    right: types.optional(types.boolean, false),
    bottom: types.optional(types.boolean, false),
    width: types.optional(types.boolean, false),
    heiht: types.optional(types.boolean, false)
  })
  .actions(commonAction(["set"]))

export const MGap = types
  .model("MGap", {
    left: types.optional(types.number, 0),
    top: types.optional(types.number, 0),
    right: types.optional(types.number, 0),
    bottom: types.optional(types.number, 0)
  })
  .actions(commonAction(["set"]))
