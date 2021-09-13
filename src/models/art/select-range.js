/*
 * @Author: 柿子
 * @Date: 2021-08-02 17:01:56
 * @LastEditTime: 2021-08-09 15:37:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/new-art/select-range.js
 */
import commonAction from "@utils/common-action"
import {getEnv, getParent, types, flow} from "mobx-state-tree"
import createLog from "@utils/create-log"
import {shortcut} from "@utils/create-event"
import sortBy from "lodash/sortBy"
import minBy from "lodash/minBy"
import maxBy from "lodash/maxBy"

const log = createLog("@models/art/select-range.js")
const MRange = types.model({
  frameId: types.union(types.string, types.number),
  boxIds: types.optional(types.array(types.union(types.string, types.number)), [])
})

export const MSelectRange = types
  .model("MSelectRange", {
    target: types.enumeration(["frame", "box"]),
    range: types.maybe(types.array(MRange)),
    x1: types.number,
    x2: types.number,
    y1: types.number,
    y2: types.number
  })
  .views((self) => ({
    get env_() {
      return getEnv(self)
    },
    get viewport_() {
      return getParent(self)
    },
    get art_() {
      return getParent(self, 2)
    },
    get boxes_() {
      const result = []
      self.range.forEach((value) => {
        const frame = self.viewport_.frames.filter((v) => v.frameId === value.frameId)[0]
        const boxes = frame.boxes.filter((v) => value.boxIds.includes(v.boxId))
        result.push(...boxes)
      })
      return result
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const {io} = self.env_
    let origin = {x1: self.x1, x2: self.x2, y1: self.y1, y2: self.y2}
    const afterCreate = () => {}
    const staff = {
      northwest: ["x1", "y1"],
      north: ["y1"],
      northeast: ["x2", "y1"],
      west: ["x1"],
      east: ["x2"],
      southwest: ["x1", "y2"],
      south: ["y2"],
      southeast: ["x2", "y2"]
    }

    let xy
    let snapXY
    const onMove = (e) => {
      const {gridUnit} = self.art_.basic
      const {isSnap} = self.art_
      if (shortcut.space) {
        return
      }
      const mouseMove = (mouseMoveEvent) => {
        const offsetX = (mouseMoveEvent.clientX - e.clientX) / self.viewport_.scaler
        const offsetY = (mouseMoveEvent.clientY - e.clientY) / self.viewport_.scaler
        xy = {
          x1: Math.round(offsetX + origin.x1),
          x2: Math.round(offsetX + origin.x2),
          y1: Math.round(offsetY + origin.y1),
          y2: Math.round(offsetY + origin.y2)
        }
        snapXY = {
          x1: Math.round(offsetX + origin.x1),
          x2: Math.round(offsetX + origin.x2),
          y1: Math.round(offsetY + origin.y1),
          y2: Math.round(offsetY + origin.y2)
        }
        if (self.target === "box" && isSnap) {
          const minXFrame = minBy(self.boxes_, (o) => o.frame_.x1_ + o.x1_).frame_
          const maxXFrame = maxBy(self.boxes_, (o) => o.frame_.x1_ + o.x2_).frame_
          const minYFrame = minBy(self.boxes_, (o) => o.frame_.y1_ + o.y1_).frame_
          const maxYFrame = maxBy(self.boxes_, (o) => o.frame_.y1_ + o.y2_).frame_
          if (offsetX > 0) {
            const temp =
              Math.ceil((xy.x2 - (maxXFrame.x1_ - maxXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                (maxXFrame.x1_ - maxXFrame.grid.extendX_) -
                gridUnit / 4 <
              xy.x2
                ? Math.ceil((xy.x2 - (maxXFrame.x1_ - maxXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                  (maxXFrame.x1_ - maxXFrame.grid.extendX_)
                : Math.floor((xy.x2 - (maxXFrame.x1_ - maxXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                    (maxXFrame.x1_ - maxXFrame.grid.extendX_) +
                    gridUnit / 4 <
                  xy.x2
                ? xy.x2
                : Math.floor((xy.x2 - (maxXFrame.x1_ - maxXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                  (maxXFrame.x1_ - maxXFrame.grid.extendX_)
            snapXY.x2 = temp
            snapXY.x1 = temp - (origin.x2 - origin.x1)
          }
          if (offsetY > 0) {
            const temp =
              Math.ceil((xy.y2 - (maxYFrame.y1_ - maxYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                (maxYFrame.y1_ - maxYFrame.grid.extendY_) -
                gridUnit / 4 <
              xy.y2
                ? Math.ceil((xy.y2 - (maxYFrame.y1_ - maxYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                  (maxYFrame.y1_ - maxYFrame.grid.extendY_)
                : Math.floor((xy.y2 - (maxYFrame.y1_ - maxYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                    (maxYFrame.y1_ - maxYFrame.grid.extendY_) +
                    gridUnit / 4 <
                  xy.y2
                ? xy.y2
                : Math.floor((xy.y2 - (maxYFrame.y1_ - maxYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                  (maxYFrame.y1_ - maxYFrame.grid.extendY_)
            snapXY.y2 = temp
            snapXY.y1 = temp - (origin.y2 - origin.y1)
          }

          if (offsetX < 0) {
            const temp =
              Math.ceil((xy.x1 - (minXFrame.x1_ - minXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                (minXFrame.x1_ - minXFrame.grid.extendX_) -
                gridUnit / 4 <
              xy.x1
                ? Math.ceil((xy.x1 - (minXFrame.x1_ - minXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                  (minXFrame.x1_ - minXFrame.grid.extendX_)
                : Math.floor((xy.x1 - (minXFrame.x1_ - minXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                    (minXFrame.x1_ - minXFrame.grid.extendX_) +
                    gridUnit / 4 <
                  xy.x1
                ? xy.x1
                : Math.floor((xy.x1 - (minXFrame.x1_ - minXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                  (minXFrame.x1_ - minXFrame.grid.extendX_)
            snapXY.x1 = temp
            snapXY.x2 = temp + (origin.x2 - origin.x1)
          }
          if (offsetY < 0) {
            const temp =
              Math.ceil((xy.y1 - (minYFrame.y1_ - minYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                (minYFrame.y1_ - minYFrame.grid.extendY_) -
                gridUnit / 4 <
              xy.y1
                ? Math.ceil((xy.y1 - (minYFrame.y1_ - minYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                  (minYFrame.y1_ - minYFrame.grid.extendY_)
                : Math.floor((xy.y1 - (minYFrame.y1_ - minYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                    (minYFrame.y1_ - minYFrame.grid.extendY_) +
                    gridUnit / 4 <
                  xy.y1
                ? xy.y1
                : Math.floor((xy.y1 - (minYFrame.y1_ - minYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                  (minYFrame.y1_ - minYFrame.grid.extendY_)
            snapXY.y1 = temp
            snapXY.y2 = temp + (origin.y2 - origin.y1)
          }
          self.set({
            ...snapXY
          })
        } else {
          self.set({
            ...xy
          })
        }
      }
      const mouseUp = () => {
        const {x1, y1, x2, y2, boxes_, target, viewport_} = self
        const updated = x1 !== origin.x1 || y1 !== origin.y1 || x2 !== origin.x2 || y2 !== origin.y2
        try {
          if (target === "frame" && updated) {
            const frame = viewport_.frames.find((o) => o.frameId === self.range[0].frameId)
            const {layout, viewLayout} = frame
            viewLayout.set({
              x: Math.round(x1),
              y: Math.round(y1),
              width: Math.round(x2 - x1),
              height: Math.round(y2 - y1)
            })
            const params = {
              layout: {
                x: Math.round(layout.x + x1 - origin.x1),
                y: Math.round(layout.y + y1 - origin.y1),
                height: Math.round(y2 - y1),
                width: Math.round(x2 - x1)
              }
            }
            frame.updateFrame(params)
          } else if (target === "box" && updated) {
            const rangeWidth = Math.round(x2 - x1)
            const rangeHeight = Math.round(y2 - y1)
            const initWidth = Math.round(origin.x2 - origin.x1)
            const initHeight = Math.round(origin.y2 - origin.y1)
            const params = []
            boxes_.forEach((box) => {
              const {layout} = box
              const {x, y, width, height} = layout
              const item = {
                x,
                y,
                width: Math.round((width / initWidth) * rangeWidth),
                height: Math.round((height / initHeight) * rangeHeight)
              }
              const offsetX = x1 - origin.x1
              const offsetY = y1 - origin.y1
              item.x = Math.round(x + offsetX)
              item.y = Math.round(y + offsetY)
              item.width = width
              item.height = height
              params.push(getBoxTransformation(box, item))
            })
            self.updateBoxes(params)
          }
        } catch (error) {
          document.body.removeEventListener("mousemove", mouseMove)
          document.body.removeEventListener("mouseup", mouseUp)
        }
        origin = {x1: self.x1, x2: self.x2, y1: self.y1, y2: self.y2}
        document.body.removeEventListener("mousemove", mouseMove)
        document.body.removeEventListener("mouseup", mouseUp)
      }
      document.body.addEventListener("mousemove", mouseMove)
      document.body.addEventListener("mouseup", mouseUp)
    }

    const onScale = (e, direct) => {
      const {gridUnit} = self.art_.basic
      const {isSnap} = self.art_
      if (shortcut.space) {
        return
      }

      const setOffset = (x, y) => {
        xy = {
          x1: Math.round(x + origin.x1),
          x2: Math.round(x + origin.x2),
          y1: Math.round(y + origin.y1),
          y2: Math.round(y + origin.y2)
        }
        snapXY = {
          x1: Math.round(x + origin.x1),
          x2: Math.round(x + origin.x2),
          y1: Math.round(y + origin.y1),
          y2: Math.round(y + origin.y2)
        }
        let canSetoffset
        let westX = origin.x2 > xy.x1 + 1
        let eastX = xy.x2 > origin.x1 + 1
        let northY = origin.y2 > xy.y1 + 1
        let southY = xy.y2 > origin.y1 + 1
        // 如果xy.x2 小于 Math.ceil(xy.x2 / gridUnit) * gridUnit - 15 那么 它的值 要么是xy.x2 否则就是 Math.ceil(xy.x2 / gridUnit) * gridUnit
        // 如果xy.x2 大于  Math.floor(xy.x2 / gridUnit) * gridUnit + 15 那么它的值 就是xy.x2 否则就是Math.floor(xy.x2 / gridUnit) * gridUnit
        if (self.target === "box" && isSnap) {
          const minXFrame = minBy(self.boxes_, (o) => o.frame_.x1_ + o.x1_).frame_
          const maxXFrame = maxBy(self.boxes_, (o) => o.frame_.x1_ + o.x2_).frame_
          const minYFrame = minBy(self.boxes_, (o) => o.frame_.y1_ + o.y1_).frame_
          const maxYFrame = maxBy(self.boxes_, (o) => o.frame_.y1_ + o.y2_).frame_
          snapXY = {
            x1:
              Math.ceil((xy.x1 - (minXFrame.x1_ - minXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                (minXFrame.x1_ - minXFrame.grid.extendX_) -
                gridUnit / 4 <
              xy.x1
                ? Math.ceil((xy.x1 - (minXFrame.x1_ - minXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                  (minXFrame.x1_ - minXFrame.grid.extendX_)
                : Math.floor((xy.x1 - (minXFrame.x1_ - minXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                    (minXFrame.x1_ - minXFrame.grid.extendX_) +
                    gridUnit / 4 <
                  xy.x1
                ? xy.x1
                : Math.floor((xy.x1 - (minXFrame.x1_ - minXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                  (minXFrame.x1_ - minXFrame.grid.extendX_),
            x2:
              Math.ceil((xy.x2 - (maxXFrame.x1_ - maxXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                (maxXFrame.x1_ - maxXFrame.grid.extendX_) -
                gridUnit / 4 <
              xy.x2
                ? Math.ceil((xy.x2 - (maxXFrame.x1_ - maxXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                  (maxXFrame.x1_ - maxXFrame.grid.extendX_)
                : Math.floor((xy.x2 - (maxXFrame.x1_ - maxXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                    (maxXFrame.x1_ - maxXFrame.grid.extendX_) +
                    gridUnit / 4 <
                  xy.x2
                ? xy.x2
                : Math.floor((xy.x2 - (maxXFrame.x1_ - maxXFrame.grid.extendX_)) / gridUnit) * gridUnit +
                  (maxXFrame.x1_ - maxXFrame.grid.extendX_),
            y1:
              Math.ceil((xy.y1 - (minYFrame.y1_ - minYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                (minYFrame.y1_ - minYFrame.grid.extendY_) -
                gridUnit / 4 <
              xy.y1
                ? Math.ceil((xy.y1 - (minYFrame.y1_ - minYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                  (minYFrame.y1_ - minYFrame.grid.extendY_)
                : Math.floor((xy.y1 - (minYFrame.y1_ - minYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                    (minYFrame.y1_ - minYFrame.grid.extendY_) +
                    gridUnit / 4 <
                  xy.y1
                ? xy.y1
                : Math.floor((xy.y1 - (minYFrame.y1_ - minYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                  (minYFrame.y1_ - minYFrame.grid.extendY_),
            y2:
              Math.ceil((xy.y2 - (maxYFrame.y1_ - maxYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                (maxYFrame.y1_ - maxYFrame.grid.extendY_) -
                gridUnit / 4 <
              xy.y2
                ? Math.ceil((xy.y2 - (maxYFrame.y1_ - maxYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                  (maxYFrame.y1_ - maxYFrame.grid.extendY_)
                : Math.floor((xy.y2 - (maxYFrame.y1_ - maxYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                    (maxYFrame.y1_ - maxYFrame.grid.extendY_) +
                    gridUnit / 4 <
                  xy.y2
                ? xy.y2
                : Math.floor((xy.y2 - (maxYFrame.y1_ - maxYFrame.grid.extendY_)) / gridUnit) * gridUnit +
                  (maxYFrame.y1_ - maxYFrame.grid.extendY_)
          }
        }
        switch (direct) {
          case "northwest":
            canSetoffset = westX && northY
            break
          case "north":
            canSetoffset = northY
            break
          case "northeast":
            canSetoffset = eastX && northY
            break
          case "east":
            canSetoffset = eastX
            break
          case "west":
            canSetoffset = westX
            break
          case "southwest":
            canSetoffset = westX && southY
            break
          case "south":
            canSetoffset = southY
            break
          case "southeast":
            canSetoffset = eastX && southY
            break
          default:
            canSetoffset = true
        }
        if (canSetoffset) {
          staff[direct].forEach((item) => {
            self.set(item, xy[item])
          })
        }
        if (canSetoffset && self.target === "box") {
          staff[direct].forEach((item) => {
            self.set(item, isSnap ? snapXY[item] : xy[item])
          })
        }
        if (canSetoffset && self.target === "frame") {
          staff[direct].forEach((item) => {
            self.set(item, xy[item])
          })
        }
      }

      const mouseMove = (mouseMoveEvent) => {
        const offsetX = (mouseMoveEvent.clientX - e.clientX) / self.viewport_.scaler
        const offsetY = (mouseMoveEvent.clientY - e.clientY) / self.viewport_.scaler
        setOffset(offsetX, offsetY)
      }

      const mouseUp = () => {
        const {x1, y1, x2, y2, boxes_, target, viewport_} = self
        const updated = x1 !== origin.x1 || y1 !== origin.y1 || x2 !== origin.x2 || y2 !== origin.y2
        try {
          if (target === "frame" && updated) {
            const frame = viewport_.frames.find((o) => o.frameId === self.range[0].frameId)
            const {layout, viewLayout} = frame
            viewLayout.set({
              x: Math.round(x1),
              y: Math.round(y1),
              width: Math.round(x2 - x1),
              height: Math.round(y2 - y1)
            })
            const params = {
              layout: {
                x: Math.round(layout.x + x1 - origin.x1),
                y: Math.round(layout.y + y1 - origin.y1),
                height: Math.round(y2 - y1),
                width: Math.round(x2 - x1)
              }
            }
            frame.updateFrame(params)
          } else if (target === "box" && updated) {
            const rangeWidth = Math.round(x2 - x1)
            const rangeHeight = Math.round(y2 - y1)
            const initWidth = Math.round(origin.x2 - origin.x1)
            const initHeight = Math.round(origin.y2 - origin.y1)
            const params = []

            boxes_.forEach((box) => {
              const {layout} = box
              const {x, y, width, height} = layout
              const item = {
                x,
                y,
                width: Math.round((width / initWidth) * rangeWidth),
                height: Math.round((height / initHeight) * rangeHeight)
              }
              const northY =
                Math.round(((box.frame_.y1_ + y - origin.y2) / initHeight) * rangeHeight) + origin.y2 - box.frame_.y1_
              const southY =
                Math.round(((box.frame_.y1_ + y - origin.y1) / initHeight) * rangeHeight) + origin.y1 - box.frame_.y1_
              const eastX =
                Math.round(((box.frame_.x1_ + x - origin.x1) / initWidth) * rangeWidth) + origin.x1 - box.frame_.x1_
              const westX =
                Math.round(((box.frame_.x1_ + x - origin.x2) / initWidth) * rangeWidth) + origin.x2 - box.frame_.x1_

              switch (direct) {
                case "northeast":
                  item.x = eastX
                  item.y = northY
                  break
                case "north":
                  item.y = northY
                  break
                case "northwest":
                  item.x = westX
                  item.y = northY
                  break
                case "east":
                  item.x = eastX
                  break
                case "west":
                  item.x = westX
                  break
                case "southeast":
                  item.x = eastX
                  item.y = southY
                  break
                case "south":
                  item.y = southY
                  break
                case "southwest":
                  item.x = westX
                  item.y = southY
                  break
                default:
                  null
              }
              params.push(getBoxTransformation(box, item))
            })
            self.updateBoxes(params)
          }
          document.body.removeEventListener("mousemove", mouseMove)
          document.body.removeEventListener("mouseup", mouseUp)
        } catch (error) {
          document.body.removeEventListener("mousemove", mouseMove)
          document.body.removeEventListener("mouseup", mouseUp)
        }
        origin = {x1: self.x1, x2: self.x2, y1: self.y1, y2: self.y2}
      }
      document.body.addEventListener("mousemove", mouseMove)
      document.body.addEventListener("mouseup", mouseUp)
    }

    const updateAverage = (direction) => {
      const {x1, y1, x2, y2} = self
      const gridCount = self.boxes_.length - 1
      const params = []
      const {gridUnit} = self.art_.basic
      if (direction === "horizontal") {
        const averageTotalWidth = x2 - x1 - gridCount * gridUnit
        const averageWidth = averageTotalWidth / self.boxes_.length
        const boxes = sortBy(self.boxes_, (o) => o.x1_)
        const startPointX = boxes[0].x1_
        boxes.forEach((box, index) => {
          const {y1_, y2_} = box
          const item = {
            x: Math.round(startPointX + index * (averageWidth + gridUnit)),
            y: Math.round(y1_),
            width: Math.round(averageWidth),
            height: Math.round(y2_ - y1_)
          }
          params.push(getBoxTransformation(box, item))
        })
      } else {
        const averageTotalHeight = y2 - y1 - gridCount * gridUnit
        const averageHeight = averageTotalHeight / self.boxes_.length
        const boxes = sortBy(self.boxes_, (o) => o.y1_)
        const startPointY = boxes[0].y1_
        boxes.forEach((box, index) => {
          const {x1_, x2_} = box
          const item = {
            x: Math.round(x1_),
            y: Math.round(startPointY + index * (averageHeight + gridUnit)),
            width: Math.round(x2_ - x1_),
            height: Math.round(averageHeight)
          }
          params.push(getBoxTransformation(box, item))
        })
      }
      self.updateBoxes(params)
    }

    const updateSpace = (direction) => {
      const {x1, y1, x2, y2} = self
      const gridCount = self.boxes_.length - 1
      const params = []
      if (direction === "horizontal") {
        const boxes = sortBy(self.boxes_, (o) => o.x1_)
        const startPointX = boxes[0].x1_
        const totalRangeWidth = x2 - x1
        const totalBoxesWidth = boxes.reduce((total, current) => total + current.layout.width, 0)
        const gridWidth = (totalRangeWidth - totalBoxesWidth) / gridCount
        boxes.forEach((box, index) => {
          const {y, height, width} = box.layout
          const offset =
            boxes.slice(0, index).reduce((total, current) => total + current.layout.width, 0) + gridWidth * index
          const item = {
            x: Math.round(startPointX + offset),
            y: Math.round(y),
            width: Math.round(width),
            height: Math.round(height)
          }
          params.push(getBoxTransformation(box, item))
        })
      } else {
        const boxes = sortBy(self.boxes_, (o) => o.y1_)
        const startPointY = boxes[0].y1_
        const totalRangeHeight = y2 - y1
        const totalBoxesHeight = boxes.reduce((total, current) => total + current.layout.height, 0)
        const gridHeight = (totalRangeHeight - totalBoxesHeight) / gridCount
        boxes.forEach((box, index) => {
          const {x, height, width} = box.layout
          const offset =
            boxes.slice(0, index).reduce((total, current) => total + current.layout.height, 0) + gridHeight * index
          const item = {
            x: Math.round(x),
            y: Math.round(startPointY + offset),
            width: Math.round(width),
            height: Math.round(height)
          }
          params.push(getBoxTransformation(box, item))
        })
      }
      self.updateBoxes(params)
    }

    const updateAlign = (direction) => {
      const minFrameX1 = minBy(self.boxes_, (o) => o.x1_).frame_.x1_
      const minX = minBy(self.boxes_, (o) => o.x1_).x1_
      const maxX = maxBy(self.boxes_, (o) => o.x2_).x2_
      const minY = minBy(self.boxes_, (o) => o.y1_).y1_
      const maxY = maxBy(self.boxes_, (o) => o.y2_).y2_
      const maxWidth = maxBy(self.boxes_, (o) => o.layout.width).layout.width
      const maxHeight = maxBy(self.boxes_, (o) => o.layout.height).layout.height
      const centerX = (self.x2 - self.x1) / 2 + self.x1
      const centerY = (self.y2 - self.y1) / 2 + self.y1
      const params = []
      switch (direction) {
        case "left":
          self.boxes_.forEach((box) => {
            const {y, width, height} = box.layout
            const item = {
              x: Math.round(minX),
              y: Math.round(y),
              width: Math.round(width),
              height: Math.round(height)
            }
            params.push(getBoxTransformation(box, item))
          })
          self.x2 = minX + minFrameX1 + maxWidth
          break
        case "right":
          self.boxes_.forEach((box) => {
            const {y, width, height} = box.layout
            const item = {
              x: Math.round(maxX - width),
              y: Math.round(y),
              width: Math.round(width),
              height: Math.round(height)
            }
            params.push(getBoxTransformation(box, item))
          })
          self.x1 = maxX - maxWidth + minFrameX1
          break
        case "center":
          self.boxes_.forEach((box) => {
            const {y, width, height} = box.layout
            const item = {
              x: Math.round((maxX - minX) / 2 + minX - width / 2),
              y: Math.round(y),
              width: Math.round(width),
              height: Math.round(height)
            }
            params.push(getBoxTransformation(box, item))
          })
          self.x1 = centerX - maxWidth / 2
          self.x2 = centerX + maxWidth / 2
          break
        case "top":
          self.boxes_.forEach((box) => {
            const {x, width, height} = box.layout
            const item = {
              x: Math.round(x),
              y: Math.round(minY),
              width: Math.round(width),
              height: Math.round(height)
            }
            params.push(getBoxTransformation(box, item))
          })
          self.y2 = self.y1 + maxHeight
          break
        case "bottom":
          self.boxes_.forEach((box) => {
            const {x, width, height} = box.layout
            const item = {
              x: Math.round(x),
              y: Math.round(maxY - height),
              width: Math.round(width),
              height: Math.round(height)
            }
            params.push(getBoxTransformation(box, item))
          })
          self.y1 = self.y2 - maxHeight
          break
        case "middle":
          self.boxes_.forEach((box) => {
            const {x, width, height} = box.layout
            const item = {
              x: Math.round(x),
              y: Math.round((maxY - minY) / 2 + minY - height / 2),
              width: Math.round(width),
              height: Math.round(height)
            }
            params.push(getBoxTransformation(box, item))
          })
          self.y1 = centerY - maxHeight / 2
          self.y2 = centerY + maxHeight / 2
          break
        default:
          null
      }
      self.updateBoxes(params)
      // 每次改变之后 原点都需要变更
      origin = {x1: self.x1, x2: self.x2, y1: self.y1, y2: self.y2}
    }

    const remove = () => {
      const {target} = self
      if (target === "frame") {
        removeFrame()
      } else {
        removeBoxes()
      }
    }

    const removeFrame = flow(function* removeFrame() {
      const {projectId, artId} = self.art_
      const {range} = self
      try {
        yield io.art.removeFrame({
          ":projectId": projectId,
          ":artId": artId,
          ":frameId": range[0].frameId
        })
        self.viewport_.removeFrame()
      } catch (error) {
        log.error("removeFrame Error: ", error)
      }
    })

    const removeBoxes = flow(function* removeBoxes() {
      const {projectId, artId} = self.art_
      const boxIds = self.boxes_.map((box) => ({
        frameId: box.frameId,
        boxId: box.boxId
      }))
      try {
        yield io.art.removeBoxes({
          ":projectId": projectId,
          ":artId": artId,
          boxIds
        })
        self.viewport_.removeBoxes()
      } catch (error) {
        log.error("select-range removeBoxes Error: ", error)
      }
    })

    const updateBoxes = flow(function* updateBoxes(params) {
      const {io} = self.env_
      const {projectId, artId} = self.art_
      try {
        yield io.art.updateBoxes({
          ":projectId": projectId,
          ":artId": artId,
          moveInfo: params
        })
      } catch (error) {
        log.error("updateBoxes Error: ", error)
      }
    })

    const getBoxTransformation = (box, item) => {
      box.layout.set({
        ...item
      })
      box.resize()
      return {
        frameId: box.frameId,
        boxId: box.boxId,
        layout: item
      }
    }

    return {
      afterCreate,
      onMove,
      onScale,
      updateAverage,
      updateSpace,
      updateAlign,
      updateBoxes,
      remove
    }
  })
