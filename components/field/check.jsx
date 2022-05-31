import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Field} from './base'
import s from './check.module.styl'

// 点选
// <CheckField label={t('选择')} options={[{value: 1, key: '阿杜'}, {value: 2, key: '撒旦'}]}/>
export const CheckField = observer(({label, tip, value, onChange, className, options, readOnly, disabledKey = []}) => {
  return (
    <Field label={label} className={className} tip={tip}>
      {options.map((option) => (
        <div
          key={option.key}
          className={c('fb1', s.checkOption, {
            [s.checkOption_checked]: value === option.value,
            [s.checkOption_readOnly]: disabledKey.length > 0 ? disabledKey.indexOf(option.value) > -1 : readOnly,
          })}
          value={option.value}
          onClick={() => {
            onChange(option.value, option)
          }}
        >
          {option.key}
        </div>
      ))}
    </Field>
  )
})
