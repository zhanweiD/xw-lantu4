import React from 'react'
import {observer} from 'mobx-react-lite'
import trim from 'lodash/trim'
import isDef from '@utils/is-def'
import {Field} from '../base'

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
      <input type={type} style="display:none" />
      <input
        type={type}
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
