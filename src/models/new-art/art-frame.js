/*
 * @Author: your name
 * @Date: 2021-07-30 16:25:21
 * @LastEditTime: 2021-08-03 15:41:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/new-art/art-frame.js
 */

import {types, getParent, getEnv, getRoot, flow} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import createLog from "@utils/create-log"
import {MBox} from "./box"
import {MArtFrameGrid} from "./art-frame-grid"
import {MLayout} from "../common/layout"

const log = createLog("@models/art/art-frame.js")
export const MArtFrame = types
  .model("MArtFrame", {
    frameId: types.union(types.string, types.number),
    artId: types.number,
    name: types.string,
    isMain: types.optional(types.boolean, false),
    // 实际上的位置信息，基于主画布的左上角坐标构建
    layout: types.maybe(MLayout),
    boxes: types.optional(types.array(MBox), []),

    // 只有创建失败时才会需要用到的属性
    isCreateFail: types.maybe(types.boolean),
    // 动态展示的位置信息，原点不定，可视区域中最小的左上角计算得出
    viewLayout: types.maybe(MLayout),
    grid: types.optional(MArtFrameGrid, {})
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get root_() {
      return getRoot(self)
    },
    get art_() {
      return getParent(self, 3)
    },
    get viewport_() {
      return getParent(self, 2)
    },
    get baseOffsetX_() {
      return getParent(self, 2).baseOffsetX
    },
    get baseOffsetY_() {
      return getParent(self, 2).baseOffsetY
    },
    get scaler_() {
      return getParent(self, 2).scaler
    },
    get x1_() {
      return self.viewLayout.x
    },
    get y1_() {
      return self.viewLayout.y
    },
    get x2_() {
      return self.x1_ + self.viewLayout.width
    },
    get y2_() {
      return self.y1_ + self.viewLayout.height
    },
    get nameX_() {
      return self.x1_ * self.scaler_ + self.baseOffsetX_
    },
    get nameY_() {
      // 24是画布标题Y轴相对于画布定边缘的偏移
      return self.y1_ * self.scaler_ + self.baseOffsetY_ - 19
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const initBox = ({artId, boxId, name, frameId, exhibit, layout}) => {
      const box = MBox.create({
        artId,
        boxId,
        name,
        frameId,
        exhibit,
        layout
      })
      self.boxes.push(box)
    }
    const recreateFrame = flow(function* recreateFrame() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {layout, name} = self
      try {
        const {frameId} = yield io.art.addFrame({
          name,
          layout,
          ":projectId": projectId,
          ":artId": artId
        })

        self.frameId = frameId
        self.isCreateFail = undefined
        self.viewport_.selectRange.set({
          range: [{frameId}]
        })
      } catch (error) {
        log.error("recreateFrame Error:", error)
      }
    })
    return {
      initBox,
      recreateFrame
    }
  })
