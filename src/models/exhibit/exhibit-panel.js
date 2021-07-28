import {getEnv, types} from "mobx-state-tree"
import {categories} from "@waves4"

export const MExhibitThumbnail = types.model("MExhibitThumbnail", {
  id: types.string,
  key: types.string,
  name: types.string,
  icon: types.string,

  // 组件类型，目前只有 wave
  lib: types.optional(types.string, ""),
  version: types.optional(types.string, "1.0.0"),
  description: types.optional(types.string, "")
})

// 组件预览分类模型
const MExhibitCategory = types
  .model("MExhibitCategory", {
    icon: types.optional(types.string, ""),
    name: types.optional(types.string, ""),
    nickName: types.optional(types.string, ""),
    exhibits: types.optional(types.array(MExhibitThumbnail), [])
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    }
  }))

export const MExhibitPanel = types.model({
  name: "exhibitPanel",
  categories: types.optional(types.array(MExhibitCategory), categories)
})
