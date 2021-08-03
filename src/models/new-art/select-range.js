/*
 * @Author: your name
 * @Date: 2021-08-02 17:01:56
 * @LastEditTime: 2021-08-03 20:03:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/new-art/select-range.js
 */
import commonAction from "@utils/common-action"
import {getEnv, getParent, types, flow} from "mobx-state-tree"
import createLog from "@utils/create-log"
import {shortcut} from "@utils/create-event"

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

    let snapXY
    let xy

    const onScale = (e, direct) => {
      if (shortcut.space) {
        return
      }

      const setOffset = (x, y) => {
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
            // const {layout, logicLayout} = viewport_.selected
            // layout.set({
            //   x: Math.round(x1),
            //   y: Math.round(y1),
            //   width: Math.round(x2 - x1),
            //   height: Math.round(y2 - y1)
            // })
            // const params = {
            //   x: Math.round(logicLayout.x + x1 - origin.x1),
            //   y: Math.round(logicLayout.y + y1 - origin.y1),
            //   height: Math.round(y2 - y1),
            //   width: Math.round(x2 - x1)
            // }
            // viewport_.selected.updateFrame(params)
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
              const northY = Math.round(((box.frame_.y1_ + y - origin.y2) / initHeight) * rangeHeight) + origin.y2 - box.frame_.y1_
              const southY = Math.round(((box.frame_.y1_ + y - origin.y1) / initHeight) * rangeHeight) + origin.y1 - box.frame_.y1_
              const eastX = Math.round(((box.frame_.x1_ + x - origin.x1) / initWidth) * rangeWidth) + origin.x1 - box.frame_.x1_
              const westX = Math.round(((box.frame_.x1_ + x - origin.x2) / initWidth) * rangeWidth) + origin.x2 - box.frame_.x1_

              const offsetX = viewport_.isSnap ? snapXY.x1 - origin.x1 : xy.x1 - origin.x1
              const offsetY = viewport_.isSnap ? snapXY.y1 - origin.y1 : xy.y1 - origin.y1
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
            // self.updateBoxes(params)
          }
          document.body.removeEventListener("mousemove", mouseMove)
          document.body.removeEventListener("mouseup", mouseUp)
          origin = {x1: self.x1, x2: self.x2, y1: self.y1, y2: self.y2}
        } catch (error) {
          document.body.removeEventListener("mousemove", mouseMove)
          document.body.removeEventListener("mouseup", mouseUp)
        }
      }
      document.body.addEventListener("mousemove", mouseMove)
      document.body.addEventListener("mouseup", mouseUp)
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
        // TODO 统一替换
        console.log(error)
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

    const getBoxTransformation = (box, item) => {
      // box.layout.set({
      //   ...item
      // })
      // box.updateBox()
      // box.resize()
      return {
        frameId: box.frameId,
        boxId: box.boxId,
        layout: item
      }
    }

    return {
      afterCreate,
      onScale,
      remove
    }
  })
