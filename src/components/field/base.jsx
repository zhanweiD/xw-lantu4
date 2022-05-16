import React from 'react'
import {observer} from 'mobx-react-lite'
import isPlainObject from 'lodash/isPlainObject'
import {getParent} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import isArray from 'lodash/isArray'
import c from 'classnames'
import makeFunction from '@utils/make-function'
import s from './base.module.styl'
import IconButton from '../icon-button'

// 几个特殊字段添加必填标识
const isKeyword = (v) => {
  if (
    v === '名称' ||
    v === '路径' ||
    v === '数据库类型' ||
    v === '数据库地址' ||
    v === '用户名' ||
    v === '密码' ||
    v === '端口' ||
    v === '数据库'
  )
    return true
}

// TODO stopDrag细化到每个输入元素
export const Field = observer(
  ({
    label,
    tip,
    labelStyle = {},
    className,
    children,
    isMulti = false,
    direction = 'horizontal',
    // supportProcessor = false,
  }) => {
    return (
      <div className={c('fbh mb8 noFieldEvent pr ml12', className)}>
        {tip && <IconButton title={tip} icon="tip" buttonSize={24} className="pa" />}
        <div
          className={c('w100p mr8', s.field, {
            // mr16: !supportProcessor,
            // mr24: supportProcessor,
            fbh: direction === 'horizontal',
            fbv: direction === 'vertical',
          })}
        >
          {isDef(label) && (
            <div className={c('fb3', !label && 'hide', s.label)} style={labelStyle}>
              {isKeyword(label) && <span className={s.red}>*</span>}
              {label}
            </div>
          )}
          <div
            className={c('fb9 pr fbh stopDrag', s.field, {
              fbv: isMulti,
              fbh: !isMulti,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)

export const commonFieldModelViews = (self) => ({
  get parent() {
    return getParent(self)
  },
  get whenIsSatisfied() {
    let isSatisfied = true
    if (isPlainObject(self.when)) {
      // 如果when的参考对象没找到，直接返回false
      if (getParent(self)[self.when.key] === undefined) {
        isSatisfied = false
      } else {
        isSatisfied = getParent(self)[self.when.key].value === self.when.value
      }
    } else if (isArray(self.when)) {
      let count = 0
      self.when.forEach((item) => {
        if (getParent(self)[item.key].value !== item.value) count++
      })
      isSatisfied = count === 0
    } else if (typeof self.when === 'string') {
      isSatisfied = makeFunction(`return ${self.when}`)(getParent(self))
    }

    return isSatisfied
  },
})
