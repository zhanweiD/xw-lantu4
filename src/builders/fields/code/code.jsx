import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import CodeBoard from '@components/code-board'
import Buttton from '@components/button'
import './code.styl'
import {Field} from '../base'

const CodeField = ({
  label,
  visible,
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
  readOnly = false,
}) => {
  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      labelClassName={labelClassName}
      label={label}
      visible={visible}
      direction="vertical"
    >
      <div className={c('w100p fbv')}>
        <div style={{height: `${height}px`, width: '100%'}} className={c('stopDrag')}>
          <CodeBoard
            placeholder={placeholder}
            value={value}
            onChange={(v) => {
              onChange(v)
            }}
            readOnly={readOnly}
            showPrintMargin={false}
            mode={mode}
          />
        </div>
        <div className="w100p fbh fbjsb mt8">
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
                    disabled={readOnly}
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
                    disabled={readOnly}
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
