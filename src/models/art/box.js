import commonAction from "@utils/common-action"
import {getEnv, getParent, types} from "mobx-state-tree"
import {MLayout} from "../common/layout"

export const MBox = types
  .model({
    boxId: types.number,
    name: types.string,
    frameId: types.number,
    artId: types.number,
    exhibit: types.frozen(),
    layout: types.maybe(MLayout),
    logicLayout: types.maybe(MLayout),
    isSelected: types.optional(types.boolean, false),
    normalKeys: types.frozen(["frameId", "boxId", "artId", "exhibit", "name"]),
    deepKeys: types.frozen(["layout"])
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get x1_() {
      return self.layout.x
    },
    get y1_() {
      return self.layout.y
    },
    get x2_() {
      return self.x1_ + self.layout.width
    },
    get y2_() {
      return self.y1_ + self.layout.height
    },
    get frame_() {
      return getParent(self, 2)
    }
  }))
  .actions(commonAction(["set", "getSchema"]))
  .actions((self) => {
    const resize = () => {
      const {layout} = self
      const {width, height} = layout
      const exhibitModel = self.frame_.art_.exhibitManager.get(self.exhibit.id)
      exhibitModel.adapter.refresh(width, height)
    }
    const updateBox = () => {
      const {x1_, y1_, layout} = self
      const {width, height} = layout
      self.logicLayout = {
        x: x1_,
        y: y1_,
        width,
        height
      }
    }

    return {
      resize,
      updateBox
    }
  })
