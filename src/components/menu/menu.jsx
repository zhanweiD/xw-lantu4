import React from 'react'
import {observer} from 'mobx-react-lite'
import isFunction from 'lodash/isFunction'
import c from 'classnames'
import Overlay from '@components/overlay'
import Icon from '@components/icon'
import s from './menu.module.styl'

/**
 * list项
 * name
 * action
 * ...
 */

const Menu = ({model, className}) => {
  console.log(className)
  let list
  if (isFunction(model.list)) {
    list = model.list()
  } else {
    list = model.list
  }

  list = list.filter((item) => item.isVisible !== false)

  return (
    <Overlay zIndex={22000} contentClassName={s.menuBox} model={model}>
      {list.length && (
        <div className={c('w100p', className)}>
          {list.map((item) => (
            <div
              key={item.name}
              className={c(
                'pl8 pr8 lh32',
                s.item,
                !item.disabled ? s.itemNormal : s.itemDisabled,
                item.hideBtmBorder && s.hideBtmBorder
              )}
              onClick={(e) => {
                if (item.disabled) return
                e.stopPropagation()
                if (isFunction(item.action)) {
                  item.action()
                }
              }}
            >
              <div className="bold fbh fbac">
                <div className="fb1">{item.name}</div>
                {item.iconName && <Icon name={item.iconName} size={12} />}
              </div>
              {item.remark && <div className="mt4 ctw84">{item.remark}</div>}
            </div>
          ))}
        </div>
      )}
      {list.length === 0 && <div className="grayNote">暂无内容</div>}
    </Overlay>
  )
}

export default observer(Menu)
