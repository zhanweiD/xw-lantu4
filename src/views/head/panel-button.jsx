import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import Icon from '@components/icon'
import s from './head.module.styl'

const PanelButton = ({name, active, className, onClick, connerMark, style}) => {
  return (
    <div
      className={c(s.panelButton, className, {
        [s.panelButton_active]: active,
      })}
      style={style}
      onClick={onClick}
    >
      {name}
      {connerMark && (
        <div className={s.cornerMark}>
          <Icon name={connerMark} size={10} />
        </div>
      )}
    </div>
  )
}
export default observer(PanelButton)
