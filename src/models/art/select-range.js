import {getEnv, getParent, types, flow, isAlive} from "mobx-state-tree"
import sortBy from "lodash/sortBy"
import minBy from "lodash/minBy"
import maxBy from "lodash/maxBy"
import {shortcut} from "@utils/create-event"
import commonAction from "@utils/common-action"
import debounce from "lodash/debounce"

const MRange = types.model({
  frameId: types.number,
  boxIds: types.optional(types.array(types.number), [])
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
    get boxes_() {
      const result = []
      self.range.forEach((value) => {
        const frame = self.viewport_.frames.filter(
          (v) => v.frameId === value.frameId
        )[0]
        const boxes = frame.boxes.filter((v) => value.boxIds.includes(v.boxId))
        result.push(...boxes)
      })
      return result
    }
  }))
  .actions(commonAction(["set"]))
  .actions((self) => {
    const {event} = self.env_
    let origin = {x1: self.x1, x2: self.x2, y1: self.y1, y2: self.y2}
    const afterCreate = () => {
      event.on(
        `art.${self.viewport_.id}.select-range.setLayout`,
        ({x1, y1, x2, y2}) => {
          self.setLayout({x1, y1, x2, y2})
        }
      )
      event.on(
        `art.${self.viewport_.id}.select-range.setDescription`,
        ({name, description}) => {
          self.setDescription({name, description})
        }
      )
      const {x1, x2, y1, y2} = self
      if (self.target === "frame") {
        event.fire(`art.${self.viewport_.id}.art-option.setLayout`, {
          x: x1,
          y: y1,
          width: x2 - x1,
          height: y2 - y1
        })
        const frame = self.viewport_.selected
        event.fire(`art.${self.viewport_.id}.art-option.setDescription`, {
          name: frame?.name,
          description: frame?.remark
        })
      } else {
        if (self.boxes_.length === 1) {
          const [box] = self.boxes_
          event.fire(`art.${self.viewport_.id}.art-option.setLayout`, {
            x: x1 - box.frame_.x1_,
            y: y1 - box.frame_.y1_,
            width: x2 - x1,
            height: y2 - y1
          })
          event.fire(`art.${self.viewport_.id}.art-option.setDescription`, {
            name: box.name,
            description: box.remark
          })
        }
      }
    }

    const debounceSetLayout = debounce(({params, frame, boxes}) => {
      if (frame) {
        frame.updateFrame(params)
      }
      // ! 这里的boxes其实是self
      if (boxes) {
        boxes.updateBoxes(params)
      }
      if (isAlive(self)) {
        origin = {x1: self.x1, x2: self.x2, y1: self.y1, y2: self.y2}
      }
    }, 2000)

    const setLayout = ({x1, y1, x2, y2}) => {
      if (self.target === "frame") {
        self.set({
          x1,
          y1,
          x2,
          y2
        })
        const {layout, logicLayout} = self.viewport_.selected
        layout.set({
          x: Math.round(x1),
          y: Math.round(y1),
          width: Math.round(x2 - x1),
          height: Math.round(y2 - y1)
        })
        const params = {
          x: Math.round(logicLayout.x + x1 - origin.x1),
          y: Math.round(logicLayout.y + y1 - origin.y1),
          height: Math.round(y2 - y1),
          width: Math.round(x2 - x1)
        }
        debounceSetLayout({params, frame: self.viewport_.selected})
      } else {
        const params = []
        const [box] = self.boxes_
        self.set({
          x1: x1 + box.frame_.x1_,
          y1: y1 + box.frame_.y1_,
          x2: x2 + box.frame_.x1_,
          y2: y2 + box.frame_.y1_
        })
        const item = {
          x: x1,
          y: y1,
          width: x2 - x1,
          height: y2 - y1
        }
        params.push(getBoxTransformation(box, item))
        debounceSetLayout({params, boxes: self})
      }
    }

    const setDescription = ({name, description}) => {
      if (self.target === "frame") {
        self.viewport_.selected.set({
          name,
          description
        })
      } else {
        const [box] = self.boxes_
        box.set({
          name,
          description
        })
      }
    }

    const staff = {
      center: ["x1", "y1", "x2", "y2"],
      northwest: ["x1", "y1"],
      north: ["y1"],
      northeast: ["x2", "y1"],
      west: ["x1"],
      east: ["x2"],
      southwest: ["x1", "y2"],
      south: ["y2"],
      southeast: ["x2", "y2"]
    }
    let snapXY
    let xy
    const onMove = (e, direct) => {
      if (shortcut.space) {
        return
      }

      const setOffset = (x, y) => {
        const {gridUnit} = self.viewport_.art_.artOption.basic
        const {isSnap} = self.viewport_
        const func = (number) => {
          return number > 0 ? Math.ceil : Math.floor
        }
        xy = {
          x1: x + origin.x1,
          x2: x + origin.x2,
          y1: y + origin.y1,
          y2: y + origin.y2
        }
        let canSetoffset
        let westX = origin.x2 > xy.x1 + 1
        let eastX = xy.x2 > origin.x1 + 1
        let northY = origin.y2 > xy.y1 + 1
        let southY = xy.y2 > origin.y1 + 1

        if (self.target === "box") {
          const minXFrame = minBy(
            self.boxes_,
            (o) => o.frame_.x1_ + o.x1_
          ).frame_
          const maxXFrame = maxBy(
            self.boxes_,
            (o) => o.frame_.x1_ + o.x2_
          ).frame_
          const minYFrame = minBy(
            self.boxes_,
            (o) => o.frame_.y1_ + o.y1_
          ).frame_
          const maxYFrame = maxBy(
            self.boxes_,
            (o) => o.frame_.y1_ + o.y2_
          ).frame_
          snapXY = {
            x1:
              minXFrame.x1_ +
              func(x)((x + origin.x1 - minXFrame.x1_) / gridUnit) * gridUnit -
              minXFrame.grid.extendX_,
            x2:
              maxXFrame.x1_ +
              func(x)((x + origin.x2 - maxXFrame.x1_) / gridUnit) * gridUnit -
              maxXFrame.grid.extendX_,
            y1:
              minYFrame.y1_ +
              func(y)((y + origin.y1 - minYFrame.y1_) / gridUnit) * gridUnit -
              minYFrame.grid.extendY_,
            y2:
              maxYFrame.y1_ +
              func(y)((y + origin.y2 - maxYFrame.y1_) / gridUnit) * gridUnit -
              maxYFrame.grid.extendY_
          }

          if (direct === "center") {
            self.set({
              x1: isSnap ? snapXY.x1 : x + origin.x1,
              x2: isSnap ? snapXY.x1 + origin.x2 - origin.x1 : x + origin.x2,
              y1: isSnap ? snapXY.y1 : y + origin.y1,
              y2: isSnap ? snapXY.y1 + origin.y2 - origin.y1 : y + origin.y2
            })
          }
        }
        if (snapXY && isSnap) {
          westX = origin.x2 > snapXY.x1
          eastX = snapXY.x2 > origin.x1
          northY = origin.y2 > snapXY.y1
          southY = snapXY.y2 > origin.y1
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
        if (canSetoffset && self.target === "box" && direct !== "center") {
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
        const offsetX =
          (mouseMoveEvent.clientX - e.clientX) / self.viewport_.scaler
        const offsetY =
          (mouseMoveEvent.clientY - e.clientY) / self.viewport_.scaler
        setOffset(offsetX, offsetY)
      }

      const mouseUp = () => {
        const {x1, y1, x2, y2, boxes_, target, viewport_} = self
        const updated =
          x1 !== origin.x1 ||
          y1 !== origin.y1 ||
          x2 !== origin.x2 ||
          y2 !== origin.y2
        if (target === "frame" && updated) {
          const {layout, logicLayout} = viewport_.selected
          layout.set({
            x: Math.round(x1),
            y: Math.round(y1),
            width: Math.round(x2 - x1),
            height: Math.round(y2 - y1)
          })
          const params = {
            x: Math.round(logicLayout.x + x1 - origin.x1),
            y: Math.round(logicLayout.y + y1 - origin.y1),
            height: Math.round(y2 - y1),
            width: Math.round(x2 - x1)
          }
          viewport_.selected.updateFrame(params)
          event.fire(`art.${viewport_.id}.art-option.setLayout`, {
            x: Math.round(x1),
            y: Math.round(y1),
            width: Math.round(x2 - x1),
            height: Math.round(y2 - y1)
          })
        } else if (target === "box" && updated) {
          const rangeWidth = Math.round(x2 - x1)
          const rangeHeight = Math.round(y2 - y1)
          const initWidth = Math.round(origin.x2 - origin.x1)
          const initHeight = Math.round(origin.y2 - origin.y1)
          const params = []

          boxes_.forEach((box) => {
            const {logicLayout} = box
            const {x, y, width, height} = logicLayout
            const item = {
              x,
              y,
              width: Math.round((width / initWidth) * rangeWidth),
              height: Math.round((height / initHeight) * rangeHeight)
            }
            const northY =
              Math.round(
                ((box.frame_.y1_ + y - origin.y2) / initHeight) * rangeHeight
              ) +
              origin.y2 -
              box.frame_.y1_
            const southY =
              Math.round(
                ((box.frame_.y1_ + y - origin.y1) / initHeight) * rangeHeight
              ) +
              origin.y1 -
              box.frame_.y1_
            const eastX =
              Math.round(
                ((box.frame_.x1_ + x - origin.x1) / initWidth) * rangeWidth
              ) +
              origin.x1 -
              box.frame_.x1_
            const westX =
              Math.round(
                ((box.frame_.x1_ + x - origin.x2) / initWidth) * rangeWidth
              ) +
              origin.x2 -
              box.frame_.x1_

            const offsetX = viewport_.isSnap
              ? snapXY.x1 - origin.x1
              : xy.x1 - origin.x1
            const offsetY = viewport_.isSnap
              ? snapXY.y1 - origin.y1
              : xy.y1 - origin.y1
            switch (direct) {
              case "center":
                item.x = Math.round(x + offsetX)
                item.y = Math.round(y + offsetY)
                item.width = width
                item.height = height
                break
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
          if (self.boxes_.length === 1) {
            event.fire(`art.${self.viewport_.id}.art-option.setLayout`, {
              x: x1 - self.boxes_[0].frame_.x1_,
              y: y1 - self.boxes_[0].frame_.y1_,
              width: x2 - x1,
              height: y2 - y1
            })
          }
        }
        document.body.removeEventListener("mousemove", mouseMove)
        document.body.removeEventListener("mouseup", mouseUp)
        origin = {x1: self.x1, x2: self.x2, y1: self.y1, y2: self.y2}
      }
      document.body.addEventListener("mousemove", mouseMove)
      document.body.addEventListener("mouseup", mouseUp)
    }

    const updateAverage = (direction) => {
      const {x1, y1, x2, y2} = self
      const gridCount = self.boxes_.length - 1
      const params = []
      const {gridUnit} = self.viewport_.art_.artOption.basic
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
        const totalBoxesWidth = boxes.reduce(
          (total, current) => total + current.logicLayout.width,
          0
        )
        const gridWidth = (totalRangeWidth - totalBoxesWidth) / gridCount
        boxes.forEach((box, index) => {
          const {y, height, width} = box.logicLayout
          const offset =
            boxes
              .slice(0, index)
              .reduce(
                (total, current) => total + current.logicLayout.width,
                0
              ) +
            gridWidth * index
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
        const totalBoxesHeight = boxes.reduce(
          (total, current) => total + current.logicLayout.height,
          0
        )
        const gridHeight = (totalRangeHeight - totalBoxesHeight) / gridCount
        boxes.forEach((box, index) => {
          const {x, height, width} = box.logicLayout
          const offset =
            boxes
              .slice(0, index)
              .reduce(
                (total, current) => total + current.logicLayout.height,
                0
              ) +
            gridHeight * index
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
      const minX = minBy(self.boxes_, (o) => o.x1_).x1_
      const maxX = maxBy(self.boxes_, (o) => o.x2_).x2_
      const minY = minBy(self.boxes_, (o) => o.y1_).y1_
      const maxY = maxBy(self.boxes_, (o) => o.y2_).y2_
      const maxWidth = maxBy(self.boxes_, (o) => o.logicLayout.width)
        .logicLayout.width
      const maxHeight = maxBy(self.boxes_, (o) => o.logicLayout.height)
        .logicLayout.height
      const centerX = (self.x2 - self.x1) / 2 + self.x1
      const centerY = (self.y2 - self.y1) / 2 + self.y1
      const params = []
      switch (direction) {
        case "left":
          self.boxes_.forEach((box) => {
            const {y, width, height} = box.logicLayout
            const item = {
              x: Math.round(minX),
              y: Math.round(y),
              width: Math.round(width),
              height: Math.round(height)
            }
            params.push(getBoxTransformation(box, item))
          })
          self.x2 = minX + maxWidth
          break
        case "right":
          self.boxes_.forEach((box) => {
            const {y, width, height} = box.logicLayout
            const item = {
              x: Math.round(maxX - width),
              y: Math.round(y),
              width: Math.round(width),
              height: Math.round(height)
            }
            params.push(getBoxTransformation(box, item))
          })
          self.x1 = maxX - maxWidth
          break
        case "center":
          self.boxes_.forEach((box) => {
            const {y, width, height} = box.logicLayout
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
            const {x, width, height} = box.logicLayout
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
            const {x, width, height} = box.logicLayout
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
            const {x, width, height} = box.logicLayout
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
      const {io} = self.env_
      const {projectId, id} = self.viewport_
      const {range} = self
      try {
        yield io.art.removeFrame({
          ":projectId": projectId,
          ":artId": id,
          ":frameId": range[0].frameId
        })
        self.viewport_.removeFrame()
      } catch (error) {
        // TODO 统一替换
        console.log(error)
      }
    })

    const removeBoxes = flow(function* removeBoxes() {
      const {io} = self.env_
      const {projectId, id} = self.viewport_
      const boxIds = self.boxes_.map((box) => ({
        frameId: box.frameId,
        boxId: box.boxId
      }))
      try {
        yield io.art.removeBoxes({
          ":projectId": projectId,
          ":artId": id,
          boxIds
        })
        self.viewport_.removeBoxes()
      } catch (error) {
        // TODO 统一替换
        console.log(error)
      }
    })

    const updateBoxes = flow(function* updateBoxes(params) {
      const {io} = self.env_
      const {projectId, id} = self.viewport_
      try {
        yield io.art.updateBoxes({
          ":projectId": projectId,
          ":artId": id,
          moveInfo: params
        })
      } catch (error) {
        // TODO 统一替换
        console.log(error)
      }
    })

    const getBoxTransformation = (box, item) => {
      box.layout.set({
        ...item
      })
      box.updateBox()
      box.resize()
      return {
        frameId: box.frameId,
        boxId: box.boxId,
        layout: item
      }
    }
    const beforeDestroy = () => {
      event.fire(`art.${self.viewport_.id}.art-option.setLayout`, {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      })
      event.fire(`art.${self.viewport_.id}.art-option.setDescription`, {
        name: "",
        description: ""
      })
      event.off(`art.${self.viewport_.id}.select-range.setLayout`)
      event.off(`art.${self.viewport_.id}.select-range.setDescription`)
    }

    return {
      afterCreate,
      beforeDestroy,
      setLayout,
      setDescription,
      updateBoxes,
      remove,
      onMove,
      updateAverage,
      updateSpace,
      updateAlign
    }
  })
