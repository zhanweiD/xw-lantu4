import React, {useRef, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import isDef from '@utils/is-def'
import autosize from 'autosize'
import {Field} from '../base'

const TextareaField = ({
  value,
  defaultValue,
  placeholder,
  onChange = () => {},
  label,
  labelClassName,
  childrenClassName,
  className,
}) => {
  const textRef = useRef(null)
  useEffect(() => {
    autosize(textRef.current)
    return () => {
      autosize.destroy(textRef.current)
    }
  })

  return (
    <Field className={className} childrenClassName={childrenClassName} labelClassName={labelClassName} label={label}>
      <textarea
        ref={textRef}
        value={isDef(value) ? value : defaultValue}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        autoComplete="off"
      />
    </Field>
  )
}

export default observer(TextareaField)
