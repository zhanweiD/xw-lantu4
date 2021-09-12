import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import CodeBoard from '@components/code-board'
import Buttton from '@components/button'
import './code.styl'
import {Field} from '../base'

const CodeField = ({
  label,
  value,
  height,
  onChange,
  labelClassName,
  childrenClassName,
  className,
  placeholder,
  mode,
  buttons = [],
  parent,
}) => {
  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      lebelClassName={labelClassName}
      label={label}
      direction="vertical"
    >
      <div className={c('w100p fbv mb8')}>
        <div style={{height: `${height}px`, width: '100%'}} className={c('stopDrag')}>
          <CodeBoard
            placeholder={placeholder}
            value={value}
            onChange={(v) => {
              onChange(v)
            }}
            showPrintMargin={false}
            mode={mode}
          />
        </div>
        <div className="w100p fbh fbjsb mt4">
          <div className="fbh">
            {buttons
              .filter(({position}) => position === 'left')
              .map((button) => {
                return (
                  <Buttton
                    key={button.name}
                    name={button.name}
                    className="mr8"
                    lineHeight={20}
                    onClick={(e) => {
                      e.stopPropagation()
                      button.action(parent)
                    }}
                  />
                )
              })}
          </div>
          <div className="fbh">
            {buttons
              .filter(({position}) => position === 'right')
              .map((button) => {
                return (
                  <Buttton
                    key={button.name}
                    name={button.name}
                    className="ml8"
                    lineHeight={20}
                    onClick={(e) => {
                      e.stopPropagation()
                      button.action(parent)
                    }}
                  />
                )
              })}
          </div>
        </div>
      </div>
    </Field>
  )
}

export default observer(CodeField)
