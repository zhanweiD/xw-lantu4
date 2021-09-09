import React, {useEffect, useRef} from 'react'
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
  labelClassName,
  childrenClassName,
  className,
}) => {
  const textRef = useRef(null)

  useEffect(() => {
    textRef.current.addEventListener('keyup', (e) => {
      e.stopPropagation()
    })
  }, [])
  return (
    <Field className={className} childrenClassName={childrenClassName} lebelClassName={labelClassName} label={label}>
      <input
        ref={textRef}
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
