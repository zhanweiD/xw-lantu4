import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Field} from '../base'
import s from './switch.module.styl'

export const Switch = observer(({value, onChange}) => (
  <div
    className={c(s.switch, {
      [s.switch_on]: value,
    })}
    onClick={() => onChange(!value)}
  />
))

const SwitchField = ({
  label,
  visible,
  value = false,
  onChange = () => {},
  className,
  childrenClassName,
  labelClassName,
}) => {
  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      lebelClassName={labelClassName}
      label={label}
      visible={visible}
    >
      <Switch value={value} onChange={(v) => onChange(v)} />
    </Field>
  )
}

export default observer(SwitchField)
