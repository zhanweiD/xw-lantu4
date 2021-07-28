import commonAction from "@utils/common-action"
import {types} from "mobx-state-tree"

export const MArtToolbar = types
  .model("MArtToolbar", {
    id: types.number,

    // 加载状态
    activeTool: types.optional(
      types.enumeration("MArtToolbar.activeTool", ["select", "createFrame"]),
      "select"
    ),

    normalKeys: types.frozen(["id", "activeTool"])
  })
  .actions(commonAction(["set", "getSchema"]))
