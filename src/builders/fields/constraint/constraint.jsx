import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Field} from '../base'
import s from './constraint.module.styl'

const ConstraintField = ({
  value,
  canCheckLine = ['top', 'right', 'bottom', 'left', 'height', 'width'],
  onChange = () => {},
  label,
  effective,
  labelClassName,
  childrenClassName,
  className,
}) => {
  console.log(value, 'value')
  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      labelClassName={labelClassName}
      label={label}
      effective={effective}
    >
      <div className={c('pr fbh fbac fbjc', s.box)}>
        {Object.entries(value).map(([key, v]) => {
          return (
            <div
              key={key}
              className={c(s.line, s[`line_${key}`], {
                [s.notAllowCheck]: !canCheckLine.includes(key),
                [s.isChecked]: v,
              })}
              onClick={() => {
                if (canCheckLine.includes(key)) {
                  onChange({...value, [key]: !v})
                }
              }}
            />
          )
        })}
        <div className={c('cfw10 pa', s.middleBox)} />
      </div>
    </Field>
  )
}

export default observer(ConstraintField)
