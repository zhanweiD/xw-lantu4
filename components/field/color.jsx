import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import trim from 'lodash/trim'
import c from 'classnames'
import isDef from '@utils/is-def'
import rgba2obj from '@utils/rgba2obj'
import {Field} from './base'
import s from './color.module.styl'

/**
 * 颜色转换方法或许可以用chroma.js
 */

export const ColorField = observer(
  ({
    label,
    tip,
    value,
    defaultValue,
    onChange = () => {},
    className,
    readOnly,
    isColorArrayForm = false,
    opacityMax = 1,
    useProcessor = false,
    supportProcessor = false,
    updateProcessor = () => {},
    hasSaveCode,
  }) => {
    const [inputValue, setInputValue] = useState()

    const canParseArray = (color) => {
      if (typeof color === 'string') {
        return color.indexOf('[') === 0 && color.indexOf(']') > 0
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
        return `rgba(${array[0]},${array[1]},${array[2]},${array[3] / opacityMax})`
      }
      return color
    }

    const getShowValue = () => {
      const realValue = isDef(value) ? value : defaultValue
      if (isColorArrayForm) {
        return transferArrayToRgb(isDef(inputValue) ? inputValue : realValue)
      }
      return realValue
    }

    return (
      <Field
        label={label}
        className={className}
        tip={tip}
        supportProcessor={supportProcessor}
        useProcessor={useProcessor}
        updateProcessor={(target) => updateProcessor(target)}
        hasSaveCode={hasSaveCode}
      >
        <div
          className={c('mr8', s.colorBox, {[s.pickerBox_readOnly]: readOnly})}
          onClick={() => {
            // colorPicker全局注册
            const {colorPicker} = window.waveview
            // 全局显示SketchPicker类型颜色选择器
            colorPicker({
              content: canParseArray(value) ? JSON.parse(value) : value,
              onChange(v) {
                onChange(v)
                isColorArrayForm && setInputValue(v)
              },
              // 颜色值是否开启数组形式
              isColorArrayForm,
              // 透明度最大值
              opacityMax,
            })
          }}
        >
          <div className={c('pa', s.colorValue)} style={{backgroundColor: getShowValue()}} />
        </div>
        <input
          type="text"
          value={getShowValue()}
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
      </Field>
    )
  }
)
