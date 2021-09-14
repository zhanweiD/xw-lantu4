import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {session} from '@utils/storage'
import IconButton from '@components/icon-button'
import s from './section.module.styl'

const allSessionIds = {}

const Title = ({className, type, icon, extra, fold, name, onClick = () => {}}) => {
  // type 仅仅有0, 1, 2这三个值 对应三种不同的section头
  return (
    <div
      className={c(
        'h24 fbh fbac mb8 bold',
        {ml24: type === 2, hand: type !== 2},
        s.title,
        s[`title_${type}`],
        className
      )}
      onClick={type !== 2 ? onClick : () => {}}
    >
      {type !== 2 && (
        <IconButton
          icon={fold ? 'arrow-right' : 'arrow-down'}
          iconFill="#fff"
          iconSize={type === 0 ? 8 : 6}
          buttonSize={24}
        />
      )}
      <div className="fb1 fbh fbac lh24">
        <div className="omit" title={name}>
          {name}
        </div>
        <div className="fbn">{icon}</div>
        {type === 1 && <div className={c('fb1 ml8', s.dashed)} />}
      </div>
      <div className={'fbn'}>{extra}</div>
    </div>
  )
}
const Section = ({
  id,
  sessionId,
  children,
  name,
  extra,
  isFold,
  onFold = () => {},
  headIcon,
  type = 0,
  className,
  titleClassName,
  childrenClassName,
}) => {
  if (allSessionIds[sessionId]) {
    console.warn(`'Section'组件有重复的'sessionId(${sessionId})'出现，请检查`)
  }
  const sessionKey = sessionId ? `section-${sessionId}` : undefined
  const [fold, setFold] = useState(sessionKey ? session.get(sessionKey, isFold) : isFold)

  return (
    <div className={c(className)} id={id}>
      <Title
        className={titleClassName}
        name={name}
        type={type}
        extra={extra}
        icon={headIcon}
        fold={fold}
        onClick={() => {
          sessionKey && session.set(sessionKey, !fold)
          setFold(!fold)
          onFold(!fold)
        }}
      />
      <div
        className={c(childrenClassName, {
          hide: fold,
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default observer(Section)
