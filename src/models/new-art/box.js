/*
 * @Author: your name
 * @Date: 2021-08-02 11:19:42
 * @LastEditTime: 2021-08-02 11:40:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /waveview-front4/src/models/new-art/box.js
 */

import commonAction from "@utils/common-action"
import {getEnv, types} from "mobx-state-tree"
import {MLayout} from "../common/layout"

export const MBox = types
  .model({
    boxId: types.number,
    name: types.string,
    frameId: types.number,
    artId: types.number,
    exhibit: types.frozen(),
    layout: types.maybe(MLayout),
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
    }
  }))
  .actions(commonAction(["set", "getSchema"]))
