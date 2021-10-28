import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'

import {Field} from '../base'
import isDef from '@utils/is-def'
import {NumberInput} from '../number'
import s from './offset.module.styl'

const OffsetField = ({label, visible, value, onChange = () => {}, labelClassName, childrenClassName, className}) => {
  const [top, right, bottom, left] = value
  const offset = {
    top,
    right,
    bottom,
    left,
  }

  console.log('oooole', label, isDef(label))

  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      lebelClassName={labelClassName}
      label={label}
      visible={visible}
    >
      <div className={c('pr fbh fbac fbjc', s.outer)}>
        {Object.entries(offset).map(([key, v]) => {
          return (
            <NumberInput
              key={key}
              className={c('center pa', s.baseInput, s[`input_${key}`])}
              value={v}
              onChange={(data) => {
                offset[key] = data
                onChange(Object.values(offset))
              }}
            />
          )
        })}
        <div className={s.inner} />
      </div>
    </Field>
  )
}

export default observer(OffsetField)
