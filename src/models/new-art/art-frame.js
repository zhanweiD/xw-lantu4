/*
 * @Author: 柿子
 * @Date: 2021-07-30 16:25:21
 * @LastEditTime: 2021-08-05 11:37:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/new-art/art-frame.js
 */

import {types, getParent, getEnv, getRoot, flow} from "mobx-state-tree"
import commonAction from "@utils/common-action"
import uuid from "@utils/uuid"
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
    const getNearlyOrigin = (origin, target) => {
      const grid = self.grid.unit_ * self.scaler_
      const x = Math.floor((target.x - origin.x) / grid) * grid - self.grid.extendX_ * self.scaler_
      const y = Math.floor((target.y - origin.y) / grid) * grid - self.grid.extendY_ * self.scaler_
      return {
        x,
        y
      }
    }

    const initBox = ({artId, boxId, name, frameId, exhibit, layout}) => {
      const {exhibitCollection, event} = self.env_
      const box = MBox.create({
        artId,
        boxId,
        name,
        frameId,
        exhibit,
        layout
      })
      self.boxes.push(box)
      const model = exhibitCollection.get(`${exhibit.lib}.${exhibit.key}`)
      if (model) {
        const art = self.art_
        art.exhibitManager.set(
          exhibit.id,
          model.initModel({
            art,
            themeId: art.basic.themeId,
            schema: exhibit,
            event
          })
        )
      }
    }

    const createBox = flow(function* createBox({position, lib, key}) {
      const {io, exhibitCollection} = self.env_
      const {artId, projectId} = self.art_
      const {frameId} = self
      const findAdapter = exhibitCollection.has(`${lib}.${key}`)
      const art = self.art_

      const model = findAdapter.value.initModel({
        art,
        themeId: art.basic.themeId,
        schema: {
          lib,
          key,
          id: uuid()
        }
      })
      const exhibit = model.getSchema()
      const frameviewport = document.querySelector(`#artFrame-${frameId}`).getBoundingClientRect()
      const gridOrigin = document.querySelector(`#artFramegrid-${frameId}`).getBoundingClientRect()
      const deviceXY = {
        x: frameviewport.x,
        y: frameviewport.y
      }
      const nomal = {
        x: position.x - deviceXY.x,
        y: position.y - deviceXY.y
      }
      const targetPosition = art.isSnap ? getNearlyOrigin(gridOrigin, position) : nomal
      const layout = {
        x: Math.round(targetPosition.x / self.scaler_),
        y: Math.round(targetPosition.y / self.scaler_),
        width: Math.round(exhibit.initSize[0]),
        height: Math.round(exhibit.initSize[1])
      }
      const boxId = uuid()
      const params = {artId, name: `容器-${boxId.substring(0, 4)}`, frameId, exhibit, layout}
      self.initBox({boxId, ...params})
      self.viewport_.toggleSelectRange({
        target: "box",
        selectRange: [
          {
            frameId,
            boxIds: [boxId]
          }
        ]
      })
      const realBox = self.boxes.find((o) => o.boxId === boxId)
      try {
        const box = yield io.art.createBox({
          exhibit,
          layout,
          layer: {},
          name: params.name,
          ":artId": params.artId,
          ":frameId": params.frameId,
          ":projectId": projectId
        })
        realBox.set({
          boxId: box.boxId
        })
        self.viewport_.selectRange.set({
          range: [
            {
              frameId,
              boxIds: [box.boxId]
            }
          ]
        })
      } catch (error) {
        realBox.set({
          isCreateFail: true
        })
        log.error("createBox Error: ", error)
      }
    })

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

    const updateFrame = flow(function* updateFrame(params) {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {frameId} = self
      try {
        yield io.art.updateFrame({
          ...params,
          ":artId": artId,
          ":projectId": projectId,
          ":frameId": frameId
        })
        self.set(params)
      } catch (error) {
        log.error("updateFrame Error:", error)
      }
    })
    const removeBoxes = (boxIds) => {
      self.boxes = self.boxes.filter((box) => !boxIds.includes(box.boxId))
    }

    return {
      initBox,
      createBox,
      removeBoxes,

      updateFrame,
      recreateFrame
    }
  })
