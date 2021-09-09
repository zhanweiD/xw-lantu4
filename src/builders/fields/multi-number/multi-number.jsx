import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import isDef from '@utils/is-def'
import Caption from '@components/caption'
import getTextWidth from '@utils/get-text-width'
import {NumberInput} from '../number'
import {Field} from '../base'
import s from './multi-number.module.styl'

const MultiNumberField = ({
  label,
  value = [],
  defaultValue = [],
  onChange = () => {},
  labelClassName,
  childrenClassName,
  className,
  items = [],
}) => {
  const {t} = useTranslation()

  return (
    <Field className={className} childrenClassName={childrenClassName} lebelClassName={labelClassName} label={label}>
      {items.map((item, index) => {
        const labelDiv = (
          <div
            className={c('lh24 oh w32 mr8', s.label, {
              ml8: index !== 0,
              [s.w24]: items.length > 3,
            })}
          >
            {t(item.key)}
          </div>
        )
        return (
          <div className="fbh" key={item.key}>
            {getTextWidth(t(item.key), 12) > (items.length > 3 ? 24 : 32) ? (
              <Caption content={t(item.key)}>{labelDiv}</Caption>
            ) : (
              labelDiv
            )}
            <div className="fb1">
              <NumberInput
                value={isDef(value[index]) ? value[index] : defaultValue[index]}
                defaultValue={defaultValue[index]}
                onChange={(v) => {
                  const clonedValue = [].concat(value)
                  clonedValue.splice(index, 1, v)
                  onChange(clonedValue)
                }}
                min={item.min}
                max={item.max}
                step={item.step}
              />
            </div>
          </div>
        )
      })}
    </Field>
  )
}

export default observer(MultiNumberField)
