// TODO 暂时弃用，后期优化工程
import React, {useRef, useLayoutEffect, useState} from "react"
import {observer} from "mobx-react-lite"
import {SketchPicker} from "react-color"
import trim from "lodash/trim"
import c from "classnames"
import isDef from "@utils/is-def"
import rgba2obj from "@utils/rgba2obj"
import hex2rgb from "@utils/hex2rgb"
import isNumberic from "@utils/is-numberic"
import {Field} from "./base"
import s from "./color.module.styl"

export const ColorField = observer(
  ({
    label,
    value,
    defaultValue,
    onChange = () => {},
    className,
    readOnly,
    isColorArrayForm = false,
    opacityMax = 1,
    isFixed = true,
    useProcessor = false,
    supportProcessor = false,
    updateProcessor = () => {}
  }) => {
    const [pickerVisible, setPickerVisible] = useState(false)
    const [inputValue, setInputValue] = useState(null)
    const colorPickerBoxRef = useRef()
    const colorRectRef = useRef()

    useLayoutEffect(() => {
      if (pickerVisible && isFixed) {
        // 展示的时候，修改colorPicker的位置，下面如果超出innerHeight， 那就展示在上边
        const colorPickerBoxDom = colorPickerBoxRef.current
        const {top, left} = colorRectRef.current.getBoundingClientRect()
        const {height} = colorPickerBoxDom.getBoundingClientRect()

        const {innerHeight} = window
        if (top + height + 24 > innerHeight) {
          colorPickerBoxDom.style.top = `${top - height - 4}px`
          colorPickerBoxDom.style.left = `${left + 40}px`
        } else {
          // 颜色rect高度24
          colorPickerBoxDom.style.top = `${top + 28}px`
          // 颜色rect宽度36
          colorPickerBoxDom.style.left = `${left + 40}px`
        }
      }
    }, [pickerVisible])

    const canParseArray = (color) => {
      if (typeof color === "string") {
        return color.indexOf("[") === 0 && color.indexOf("]") > 0
      }
      return false
    }

    // 转换rgb数组为rgb字符串
    const transferArrayToRgb = (color) => {
      if (!Array.isArray(color) && !canParseArray(color)) {
        // 返回color字符串
        return color
      }
      const array = canParseArray(color) ? JSON.parse(color) : color
      if (array.length === 3) {
        return `rgb(${array[0]},${array[1]},${array[2]})`
      }
      if (array.length === 4) {
        return `rgba(${array[0]},${array[1]},${array[2]},${
          array[3] / opacityMax
        })`
      }
      return color
    }

    const rgbaOrderObject = (colorPickValue) => {
      if (Array.isArray(colorPickValue)) {
        const colorArray = colorPickValue
        return {
          r: colorArray[0],
          g: colorArray[1],
          b: colorArray[2],
          a: colorArray[3] / opacityMax
        }
      }

      const color = hex2rgb(colorPickValue)
        .replace(/rgba\(/i, "")
        .replace(/rgb\(/i, "")
        .replace(")", "")
        .split(",")
      const inspectColor =
        hex2rgb(colorPickValue).search(/rgb/i) === 0 && color.length > 2
          ? color.map((item) => (isNumberic(item) ? Number(item) : 0))
          : [0, 0, 0, 1]
      return {
        r: inspectColor[0],
        g: inspectColor[1],
        b: inspectColor[2],
        a: inspectColor[3]
      }
    }

    return (
      <Field
        label={label}
        className={className}
        supportProcessor={supportProcessor}
        useProcessor={useProcessor}
        updateProcessor={(target) => updateProcessor(target)}
      >
        <div
          className={c("mr8", s.colorBox, {[s.pickerBox_readOnly]: readOnly})}
          onClick={() => {
            setPickerVisible(true)
          }}
        >
          <div
            className={c("pa", s.colorValue)}
            ref={colorRectRef}
            style={{backgroundColor: transferArrayToRgb(value)}}
          />
        </div>
        <input
          type="text"
          value={
            !isColorArrayForm
              ? isDef(value)
                ? value
                : defaultValue
              : inputValue === null
              ? transferArrayToRgb(isDef(value) ? value : defaultValue)
              : transferArrayToRgb(inputValue)
          }
          disabled={readOnly}
          onChange={(e) => {
            if (isColorArrayForm) {
              const rgba = rgba2obj(trim(e.target.value), opacityMax)
              onChange([rgba.r, rgba.g, rgba.b, rgba.a])
              // 记录文本输入值
              setInputValue(trim(e.target.value))
            } else {
              onChange(trim(e.target.value))
            }
          }}
        />
        {/* TODO 临时方案，这周把颜色面板置于overlay */}
        {pickerVisible && (
          <div
            ref={colorPickerBoxRef}
            className={s.pickerBox}
            style={{position: isFixed ? "fixed" : "absolute"}}
          >
            {/* 用一个fixed的div 展示在colorPicker下面，点击这个div时，触发关闭 */}
            <div onClick={() => setPickerVisible(false)} className={s.cover} />
            {/* {!isColorArrayForm && themeColors && <TwitterPicker
          color={rgba2obj(value, opacityMax)}
          colors={themeColors}
          onChange={color => {
            const rgba = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
            onChange(rgba)
          }} />} */}
            <SketchPicker
              color={rgbaOrderObject(value)}
              onChange={(color) => {
                const rgba = !isColorArrayForm
                  ? color.rgb.a !== 1
                    ? `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
                    : `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`
                  : [
                      color.rgb.r,
                      color.rgb.g,
                      color.rgb.b,
                      color.rgb.a * opacityMax
                    ]
                onChange(rgba)
              }}
            />
          </div>
        )}
      </Field>
    )
  }
)
