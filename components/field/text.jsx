import React, {useEffect, useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import trim from 'lodash/trim'
import IconButton from '@components/icon-button'
import Icon from '@components/icon'
import isDef from '@utils/is-def'
import makeFunction from '@utils/make-function'
import {Field} from './base'
import s from './text.module.styl'

// 单行文本
// <TextField label={t('名称')} value={xxx.name} onChange={e=>xxx.setName(e.target.value)}/>
export const TextField = observer(
  ({
    label,
    tip,
    value,
    defaultValue,
    className,
    onChange = () => {},
    style,
    readOnly,
    placeholder,
    onBlur = () => {},
    type = 'text',
    iconName,
    iconShowName,
    onIconButtonClick = () => {},
    valid,
    noField,
  }) => {
    const {message, success = true} = isDef(valid) ? makeFunction(valid)(value) : {}
    const codeRef = useRef(null)

    useEffect(() => {
      codeRef.current.addEventListener('keyup', (e) => {
        e.stopPropagation()
      })
    }, [])

    // !NOTE value属性错误的写法：value={value || defaultValue} 会导致输入过程不能为空字符串
    return (
      <>
        <Field noField={noField} label={label} tip={tip} className={c(className, {[s.valid]: !success})} style={style}>
          <input
            contentEditable
            type={type}
            ref={codeRef}
            disabled={readOnly}
            value={isDef(value) ? value : defaultValue}
            placeholder={placeholder}
            autoComplete="off"
            readOnly={type === 'password'}
            onFocus={(e) => {
              // 阻止表单自动填充
              if (type === 'password') {
                e.target.removeAttribute('readonly')
                e.target.autocomplete = 'new-password'
              }
            }}
            onChange={(e) => {
              e.stopPropagation()
              // 禁止输入'\n'特殊字符
              if (e.target.value.indexOf('\\n') > -1) {
                console.warn("禁止输入'\\n'特殊字符")
              }
              onChange(trim(e.target.value.replace(/\\n/g, '')))
            }}
            onBlur={(e) => {
              onBlur(e.target.value)
              if (trim(e.target.value) === '') {
                onChange(defaultValue)
              }
            }}
          />
          {/* 图标按钮 */}
          {iconName && (
            <IconButton
              icon={iconName}
              className={c('pa', s.iconButton)}
              buttonSize={28}
              onClick={() => {
                onIconButtonClick()
              }}
            />
          )}
          {iconShowName && (
            <Icon
              name={iconShowName}
              className={c('pa', s.iconButton)}
              size={14}
              onClick={() => {
                onIconButtonClick()
              }}
            />
          )}
        </Field>

        {valid && (
          <Field
            noField={noField}
            label={label ? ' ' : ''}
            className={c('mt8', {
              [s.tipError]: !success,
              [s.tipSuccess]: success,
            })}
          >
            {message}
          </Field>
        )}
      </>
    )
  }
)
