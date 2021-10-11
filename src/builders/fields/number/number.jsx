import React, {useEffect, useState, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import np from 'number-precision'
import isNumber from 'lodash/isNumber'
import c from 'classnames'
import trim from 'lodash/trim'
import isNumeric from '@utils/is-numberic'
import fixRange from '@utils/fix-range'
import isDef from '@utils/is-def'
import {Field} from '../base'
import s from './number.module.styl'

const isSpecialString = (string, min) =>
  ['', (isNumber(min) && min < 0) || !isDef(min) ? '-' : '', '+', '.'].indexOf(string) > -1

export const NumberRange = ({min, max}) => {
  let range
  if (isDef(min) && isDef(max)) {
    range = `${min}-${max}`
  } else if (isDef(min)) {
    range = `>${min}`
  } else if (isDef(max)) {
    range = `<${max}`
  }
  return <div className={c('ctw40', s.range)}>{range}</div>
}

export const NumberInput = observer(
  ({value, defaultValue = 0, onChange, min, max, step, placeholder, className, toggleFocus = () => {}}) => {
    const numberRef = useRef(null)
    useEffect(() => {
      numberRef.current.addEventListener('keyup', (e) => {
        e.stopPropagation()
      })
    }, [])

    // !NOTE value属性错误的写法：value={value || defaultValue} 会导致输入过程不能为空字符串
    return (
      <input
        className={className}
        type="text"
        ref={numberRef}
        value={isDef(value) ? value : defaultValue}
        placeholder={placeholder}
        onKeyDown={(e) => {
          const v = trim(e.target.value)
          if (isNumeric(v)) {
            let n = +v
            if (e.key === 'ArrowUp') {
              n = np.plus(n, step)
            }
            if (e.key === 'ArrowDown') {
              n = np.minus(n, step)
            }

            // 仅按上下键的时候才触发值的改变
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              onChange(fixRange(n, min, max))
            }
          }
        }}
        onFocus={() => toggleFocus(true)}
        onBlur={(e) => {
          const v = trim(e.target.value)
          // 如果是合理的特殊字符
          if (isSpecialString(v, min)) {
            onChange(defaultValue)
          } else if (isNumeric(v)) {
            onChange(fixRange(+v, min, max))
          }
          if (!(e.relatedTarget && e.relatedTarget.className.indexOf('numberSlider') > -1)) {
            toggleFocus(false)
          }
        }}
        onChange={(e) => {
          const v = trim(e.target.value)
          if (isSpecialString(v, min) || isNumeric(v)) {
            onChange(v)
          }
        }}
      />
    )
  }
)

const NumberField = ({
  label,
  visible,
  value,
  defaultValue,
  onChange = () => {},
  labelClassName,
  childrenClassName,
  className,
  min,
  max,
  step = 1,
  hasSlider,
  placeholder,
}) => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      lebelClassName={labelClassName}
      label={label}
      visible={visible}
    >
      <div className="fb1 pr">
        <NumberInput
          className={c({[s.sliderFocus]: hasSlider && isFocus})}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          toggleFocus={(status) => hasSlider && setIsFocus(status)}
        />
        {hasSlider && isFocus && (
          <input
            type="range"
            className={c('pa numberSlider', s.slider)}
            min={min}
            max={max}
            step={step}
            value={value}
            onBlur={(e) => {
              if (!(e.relatedTarget && e.relatedTarget.className.indexOf('sliderFocus') > -1)) {
                setIsFocus(false)
              }
            }}
            onChange={(e) => {
              onChange(+e.target.value)
            }}
          />
        )}
      </div>
      <NumberRange min={min} max={max} />
    </Field>
  )
}

export default observer(NumberField)
