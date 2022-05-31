/*
 * @Author: 柿子
 * @Date: 2021-07-30 17:46:29
 * @LastEditTime: 2021-07-30 17:47:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/new-art/art-frame-grid.js
 */

import {getParent, types} from 'mobx-state-tree'

export const MArtFrameGrid = types.model().views((self) => ({
  get grid_() {
    return getParent(self, 4).global.options.sections.grid
  },
  get unit_() {
    const size = self.grid_.fields.size
    return size.value
  },
  get lineOpacity_() {
    const lineOpacity = self.grid_.fields.opacity.value
    return lineOpacity
  },
  get lineColor_() {
    const lineColor = self.grid_.fields.singleColor.value
    return lineColor
  },
  get guideLineOpacity_() {
    const guideLineOpacity = self.grid_.sections.divisionLine.fields.opacity.value

    return guideLineOpacity
  },
  get guideLineColor_() {
    const guideLineColor = self.grid_.sections.divisionLine.fields.singleColor.value

    return guideLineColor
  },

  get originWidth_() {
    return getParent(self).viewLayout.width
  },
  get originHeight_() {
    return getParent(self).viewLayout.height
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
  },
}))
