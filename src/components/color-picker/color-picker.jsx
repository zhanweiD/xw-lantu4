import React, {useEffect, useRef} from 'react'
import {SketchPicker} from 'react-color'
import {observer} from 'mobx-react-lite'
import isFunction from 'lodash/isFunction'
import Overlay from '@components/overlay'
import w from '@models'
import s from './color-picker.module.styl'

const ColorPicker = ({model}) => {
  const {colorPickerBox} = w
  const {onChange} = model
  const colorRef = useRef(null)
  useEffect(() => {
    colorRef.current.addEventListener('keyup', (e) => {
      e.stopPropagation()
    })
  }, [])
  return (
    <Overlay model={model} zIndex={21099} isScroll={false}>
      <div className={s.pickerBox} ref={colorRef}>
        <SketchPicker
          color={colorPickerBox.rgbaOrderObject}
          disableAlpha
          onChange={(color) => {
            const rgba = `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`

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
