/*
 * @Author: 柿子
 * @Date: 2021-07-29 16:18:31
 * @LastEditTime: 2021-07-30 09:56:24
 * @LastEditors: Please set LastEditors
 * @Description: 数据屏全局属性
 * @FilePath: /waveview-front4/src/models/new-art/art-basic.js
 */

import commonAction from "@utils/common-action"
import {reaction} from "mobx"
import {types, getParent} from "mobx-state-tree"
import {themeConfigs} from "@utils/theme"

const MWatermark = types
  .model("MWatermark", {
    isEnable: types.optional(types.boolean, false),
    value: types.optional(types.string, ""),
    rotation: types.optional(types.frozen(), -15),
    opacity: types.optional(types.number, 1)
  })
  .actions(commonAction(["set"]))

const MPassword = types
  .model("MPassword", {
    isEnable: types.optional(types.boolean, false),
    value: types.optional(types.string, "")
  })
  .actions(commonAction(["set"]))

export const MArtBasic = types
  .model("MArtBaisc", {
    // 主题色
    themeId: types.optional(
      types.enumeration([
        "fairyLand",
        "emeraldGreen",
        "duskUniverse",
        "glaze",
        "exquisite",
        "blueGreen",
        "greenRed",
        "blueRed",
        "orangePurple",
        "brownGreen"
      ]),
      "glaze"
    ),
    // 网格尺寸
    gridUnit: types.optional(types.number, 40),
    // 水印
    watermark: types.optional(MWatermark, {}),
    // 访问权限密码
    password: types.optional(MPassword, {}),
    normalKeys: types.frozen(["themeId", "gridUnit", "watermark", "password"])
  })
  .views((self) => ({
    get art_() {
      return getParent(self, 2)
    }
  }))
  .actions(commonAction(["set", "setSchema", "getSchema"]))
  .actions((self) => {
    let reactionDisposer
    const afterSetSchema = () => {
      reactionDisposer = reaction(
        () => {
          return {
            themeColors: themeConfigs[self.themeId].colors,
            baseFontSize: (1080 / 1050).toFixed(2) - 0
          }
        },
        (newContext) => {
          // 取到当前大屏的所有组件
          const models = self.art_.exhibitManager._data

          if (models) {
            Object.values(models).forEach((model) => {
              model.setContext(newContext)
              model.adapter && model.adapter.refresh()
            })
          }
        },
        {
          // delay: 3000,
          fireImmediately: false,
          onError(error) {
            console.log("~~ save schema error:", error)
          }
        }
      )
    }
    const beforeDestroy = () => {
      reactionDisposer && reactionDisposer()
    }

    return {
      afterSetSchema,
      beforeDestroy
    }
  })
