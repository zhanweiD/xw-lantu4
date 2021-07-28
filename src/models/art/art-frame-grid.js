import {getParent, types} from "mobx-state-tree"

export const MArtFrameGrid = types.model().views((self) => ({
  get unit_() {
    return Math.max(getParent(self, 4).artOption.basic.gridUnit, 16)
  },

  get originWidth_() {
    return getParent(self).layout.width
  },
  get originHeight_() {
    return getParent(self).layout.height
  },
  // 网格数量
  get countX_() {
    return Math.ceil(self.originWidth_ / self.unit_)
  },
  // 网格数量
  get countY_() {
    return Math.ceil(self.originHeight_ / self.unit_)
  },
  get width_() {
    return self.unit_ * self.countX_
  },
  get height_() {
    return self.unit_ * self.countY_
  },
  // 两个方向上各自需要向外延伸的距离
  get extendX_() {
    return (self.width_ - self.originWidth_) / 2
  },
  // 两个方向上各自需要向外延伸的距离
  get extendY_() {
    return (self.height_ - self.originHeight_) / 2
  }
}))
