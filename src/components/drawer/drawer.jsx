import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import IconButton from '@components/icon-button'
import s from './drawer.module.styl'

const Drawer = ({children, className, title, visible, onClose = () => {}}) => {
  return (
    <div
      className={c(
        s.drawer,
        {
          [s.visible]: visible,
        },
        className
      )}
    >
      <div className={c('fbh fbac fbjsb pr', s.title)}>
        <div className="fbn pl8">{title}</div>
        <IconButton
          className="mr8"
          icon="close"
          iconSize={14}
          title="关闭"
          onClick={() => {
            onClose()
          }}
        />
      </div>
      <div className="mt8 mb8">{children}</div>
    </div>
  )
}

export default observer(Drawer)
