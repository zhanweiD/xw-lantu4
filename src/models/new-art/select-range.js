/*
 * @Author: your name
 * @Date: 2021-08-02 17:01:56
 * @LastEditTime: 2021-08-03 17:08:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/new-art/select-range.js
 */
import commonAction from "@utils/common-action"
import {getEnv, getParent, types, flow} from "mobx-state-tree"

const MRange = types.model({
  frameId: types.union(types.string, types.number),
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
    const afterCreate = () => {}
    const remove = () => {
      console.log(self)
      const {target} = self
      if (target === "frame") {
        removeFrame()
      } else {
        removeBoxes()
      }
    }
    const removeFrame = flow(function* removeFrame() {
      const {io} = self.env_
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

    const removeBoxes = () => {}

    return {
      afterCreate,
      remove
    }
  })
