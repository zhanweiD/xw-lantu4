import React from 'react'
import {observer} from 'mobx-react-lite'
import trim from 'lodash/trim'
import c from 'classnames'
import isDef from '@utils/is-def'
import {Field} from '../base'
import s from './color.module.styl'

const ColorField = ({
  label,
  visible,
  value,
  defaultValue,
  onChange = () => {},
  className,
  labelClassName,
  childrenClassName,
}) => {
  const getShowValue = () => {
    const realValue = isDef(value) ? value : defaultValue
    return realValue
  }

  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      lebelClassName={labelClassName}
      label={label}
      visible={visible}
    >
      <div
        className={c('mr8', s.colorBox)}
        onClick={() => {
          // colorPicker全局注册
          const {colorPicker} = window.waveview
          // 全局显示SketchPicker类型颜色选择器
          colorPicker({
            content: value,
            onChange(v) {
              onChange(v)
            },
          })
        }}
      >
        <div className={c('pa', s.colorValue)} style={{backgroundColor: getShowValue()}} />
      </div>
      <input
        type="text"
        value={getShowValue()}
        onChange={(e) => {
          onChange(trim(e.target.value))
        }}
      />
    </Field>
  )
}

export default observer(ColorField)
