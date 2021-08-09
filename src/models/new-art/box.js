/*
 * @Author: 柿子
 * @Date: 2021-08-02 11:19:42
 * @LastEditTime: 2021-08-04 15:12:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/new-art/box.js
 */

import commonAction from "@utils/common-action"
import {getEnv, types, getParent, flow} from "mobx-state-tree"
import {MLayout} from "../common/layout"
import createLog from "@utils/create-log"

const log = createLog("@models/art/box.js")
export const MBox = types
  .model({
    boxId: types.union(types.string, types.number),
    name: types.string,
    frameId: types.number,
    artId: types.number,
    exhibit: types.frozen(),
    layout: types.maybe(MLayout),

    // 只有创建失败时才会需要用到的属性
    isCreateFail: types.maybe(types.boolean),

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
    get art_() {
      return getParent(self, 5)
    },
    get viewport_() {
      return getParent(self, 4)
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
      const exhibitModel = self.art_.exhibitManager.get(self.exhibit.id)
      if (exhibitModel.adapter) {
        // 这个if是暂时性的 因为没对接exhibit
        exhibitModel.adapter.refresh(width, height)
      }
    }
    const recreateBox = flow(function* recreateBox() {
      const {io} = self.env_
      const {artId, projectId} = self.art_
      const {layout, name, frameId, exhibit} = self
      try {
        const box = yield io.art.createBox({
          exhibit,
          layout,
          layer: {},
          name,
          ":artId": artId,
          ":frameId": frameId,
          ":projectId": projectId
        })

        self.boxId = box.boxId
        self.isCreateFail = undefined
        self.viewport_.selectRange.set({
          range: [{frameId}]
        })
      } catch (error) {
        log.error("recreateBox Error: ", error)
      }
    })

    return {
      resize,
      recreateBox
    }
  })
