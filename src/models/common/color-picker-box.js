import {types} from "mobx-state-tree"
import isNumberic from "@utils/is-numberic"
import hex2rgb from "@utils/hex2rgb"

export const MColorPickerBox = types
  .model("MColorPickerBox", {
    // 颜色选择器显示颜色选择值
    colorPickValue: types.frozen(),
    opacityMax: types.optional(types.number, 1)
  })
  .views((self) => ({
    get rgbaOrderObject() {
      if (Array.isArray(self.colorPickValue)) {
        const colorArray = self.colorPickValue
        return {
          r: colorArray[0],
          g: colorArray[1],
          b: colorArray[2],
          a: colorArray[3] / self.opacityMax
        }
      }

      const color = hex2rgb(self.colorPickValue)
        .replace(/rgba\(/i, "")
        .replace(/rgb\(/i, "")
        .replace(")", "")
        .split(",")
      const inspectColor =
        hex2rgb(self.colorPickValue).search(/rgb/i) === 0 && color.length > 2
          ? color.map((item) => (isNumberic(item) ? Number(item) : 0))
          : [0, 0, 0, 1]
      return {
        r: inspectColor[0],
        g: inspectColor[1],
        b: inspectColor[2],
        a: inspectColor[3]
      }
    }
  }))
  .actions((self) => ({
    setValue(value) {
      self.colorPickValue = value
    },
    setOpacityMax(opacityMax) {
      self.opacityMax = opacityMax
    }
  }))
