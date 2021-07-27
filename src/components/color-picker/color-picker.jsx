import React from "react"
import {SketchPicker} from "react-color"
import {observer} from "mobx-react-lite"
import isFunction from "lodash/isFunction"
import Overlay from "@components/overlay"
import w from "@models"
import s from "./color-picker.module.styl"

const ColorPicker = ({model}) => {
  const {colorPickerBox} = w
  const {onChange, isColorArrayForm, opacityMax} = model

  return (
    <Overlay model={model} zIndex={21099} isScroll={false}>
      <div className={s.pickerBox}>
        <SketchPicker
          color={colorPickerBox.rgbaOrderObject}
          onChange={(color) => {
            const rgba = !isColorArrayForm
              ? color.rgb.a !== 1
                ? `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
                : `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`
              : color.rgb.a !== 1
              ? [
                  color.rgb.r,
                  color.rgb.g,
                  color.rgb.b,
                  color.rgb.a * opacityMax
                ]
              : [color.rgb.r, color.rgb.g, color.rgb.b]
            if (isFunction(onChange)) {
              onChange(rgba)
              // 更新颜色选择器value显示
              colorPickerBox.setValue(rgba)
            }
          }}
        />
      </div>
    </Overlay>
  )
}

export default observer(ColorPicker)
