import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Field} from '../base'
import Icon from '@components/icon'
import s from './check.module.styl'

// 点选
const CheckField = ({label, value, onChange, className, options}) => {
  console.log(options)
  return (
    <Field label={label} className={className}>
      {options.map((option) => (
        <div
          key={option.value}
          className={c('fb1 fbh fbac fbjc', s.checkOption, {
            [s.checkOption_checked]: value === option.value,
          })}
          value={option.value}
          onClick={() => {
            onChange(option.value, option)
          }}
        >
          {option.icon ? <Icon name="add" size={12} fill="#ffffff" /> : option.key}
        </div>
      ))}
    </Field>
  )
}

export default observer(CheckField)
