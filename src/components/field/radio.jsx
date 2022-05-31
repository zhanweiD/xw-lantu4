import React from 'react'
import c from 'classnames'
import s from './radio.module.styl'

const Radio = ({value, children, className, checkedValue, onChange}) => {
  return (
    <div onClick={() => onChange && onChange(value)} className={c(s.radio_box, className)}>
      <input
        checked={value === checkedValue}
        value={value}
        onChange={() => undefined}
        className="radio-input"
        type="radio"
      />
      <label htmlFor={value}>{children}</label>
    </div>
  )
}

// 只做受控
const Group = ({children, onChange, value, className}) => {
  return (
    <div className={c('fbh fbw', className)}>
      {React.Children.toArray(children).map((child) =>
        React.cloneElement(child, {
          key: child.props.value,
          checkedValue: value,
          onChange: (v) => onChange && onChange(v),
        })
      )}
    </div>
  )
}

Radio.Group = Group

export default Radio
