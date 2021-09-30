import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Field} from '../base'
import s from './constraint.module.styl'
import horizontalLine from './images/constrain-fixed-h.svg'
import verticalLine from './images/constrain-fixed-v.svg'
import widthLine from './images/constrain-fixed-width.svg'
import heightLine from './images/constrain-fixed-height.svg'
import vhorizontalLine from './images/constrain-unfixed-h.svg'
import vverticalLine from './images/constrain-unfixed-v.svg'
import vwidthLine from './images/constrain-unfixed-width.svg'
import vheightLine from './images/constrain-unfixed-height.svg'

const getLine = (type, isChecked) => {
  const line = {
    top: isChecked ? verticalLine : vverticalLine,
    right: isChecked ? horizontalLine : vhorizontalLine,
    bottom: isChecked ? verticalLine : vverticalLine,
    left: isChecked ? horizontalLine : vhorizontalLine,
    width: isChecked ? widthLine : vwidthLine,
    height: isChecked ? heightLine : vheightLine,
  }
  return line[type]
}

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
            <img
              key={key}
              className={c(s.line, s[`line_${key}`], {
                [s.notAllowCheck]: !canCheckLine.includes(key),
              })}
              src={getLine(key, v)}
              alt=""
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
