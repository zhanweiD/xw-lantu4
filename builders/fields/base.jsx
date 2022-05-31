import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import isDef from '@utils/is-def'
import s from './base.module.styl'

export const Field = observer(
  ({className, direction = 'horizontal', label, visible, labelClassName, childrenClassName, children}) => {
    return (
      <div
        className={c('mb8 noFieldEvent pr fbac mr8', className, {
          fbh: direction === 'horizontal',
          fbv: direction === 'vertical',
          hide: visible === false,
        })}
      >
        {isDef(label) && label.length !== 0 && <div className={c('fb3', s.label, labelClassName)}>{label}</div>}
        <div className={c('fb9 pr fbh stopDrag', s.field, childrenClassName)}>{children}</div>
      </div>
    )
  }
)
