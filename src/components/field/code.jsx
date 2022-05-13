import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import CodeBoard from '@components/code-board'
import Buttton from '@components/button'
import s from './code.module.styl'
import './code.styl'
import {Field} from './base'

export const CodeField = observer(
  ({
    label,
    tip,
    value,
    height,
    onChange,
    className,
    placeholder,
    readOnly,
    readOnlyCode,
    mode,
    buttons = [],
    parent,
  }) => {
    const codeRef = useRef(null)

    useEffect(() => {
      codeRef.current.addEventListener('keyup', (e) => {
        e.stopPropagation()
      })
    }, [])
    return (
      <Field label={label} tip={tip} className={className} direction="vertical">
        <div ref={codeRef} className={c('w100p fbv mb8', className)}>
          <div className="w100p fbh fbjsb mt4 mb8">
            <div className="fbh">
              {buttons
                .filter(({position}) => position === 'topLeft')
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
                .filter(({position}) => position === 'topRight')
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
          <div
            style={{height: `${height}px`, width: '100%'}}
            className={c('stopDrag', {
              [s.code_readOnly]: readOnly,
              readOnlyCode,
            })}
          >
            <CodeBoard
              placeholder={placeholder}
              value={value}
              onChange={(v) => {
                onChange(v)
              }}
              readOnly={readOnlyCode}
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
)
