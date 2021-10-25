import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import trim from 'lodash/trim'
import isDef from '@utils/is-def'
import {Field} from '../base'
import s from './text.module.styl'

const TextField = ({
  value,
  defaultValue,
  placeholder,
  onChange = () => {},
  type = 'text',
  label,
  visible,
  labelClassName,
  childrenClassName,
  className,
}) => {
  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      labelClassName={labelClassName}
      label={label}
      visible={visible}
    >
      <input
        type="text"
        className={c({
          [s.password]: type === 'password',
        })}
        value={isDef(value) ? value : defaultValue}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => {
          if (e.target.value.indexOf('\\n') > -1) {
            console.warn("禁止输入'\\n'特殊字符")
          }
          onChange(trim(e.target.value.replace(/\\n/g, '')))
        }}
      />
    </Field>
  )
}

export default observer(TextField)
