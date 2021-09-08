import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Field} from '../base'
import Icon from '@components/icon'
import s from './check.module.styl'

// 点选
const CheckField = ({label, value, onChange, labelClassName, childrenClassName, className, options}) => {
  return (
    <Field className={className} childrenClassName={childrenClassName} lebelClassName={labelClassName} label={label}>
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
          {option.icon ? <Icon name={option.icon} size={12} fill="#ffffff" /> : option.key}
        </div>
      ))}
    </Field>
  )
}

export default observer(CheckField)
