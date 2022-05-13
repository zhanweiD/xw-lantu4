import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Field} from './base'
import s from './switch.module.styl'

export const Switch = observer(({value, onChange, readOnly, className}) => (
  <div
    className={c(s.switch, className, {
      [s.switch_on]: value,
      [s.switch_readOnly]: readOnly,
    })}
    onClick={() => onChange(!value)}
  />
))

export const SwitchField = observer(({label, tip, value = false, onChange = () => {}, className, readOnly}) => {
  return (
    <Field label={label} tip={tip} className={className}>
      <Switch value={value} onChange={(v) => onChange(v)} readOnly={readOnly} />
    </Field>
  )
})
