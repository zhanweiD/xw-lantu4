import React, {useState, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import {session} from '@utils/storage'
import IconButton from '@components/icon-button'
import s from './section.module.styl'

const allSessionIds = {}

const Title = ({className, type, icon, extra, fold, name, onClick = () => {}, titleClick = () => {}}) => {
  const {t} = useTranslation()
  // type 仅仅有0, 1, 2这三个值 对应三种不同的section头 3图层成组
  return (
    <div
      className={c('h24 fbh fbac bold', {ml24: type === 2, hand: type !== 2}, s.title, s[`title_${type}`], className)}
      // onClick={type !== 2 ? onClick : () => {}}
    >
      {type !== 2 && (
        <IconButton
          icon={fold ? 'arrow-right' : 'arrow-down'}
          iconFill="#fff"
          iconSize={type === 0 ? 8 : 6}
          buttonSize={24}
          onClick={type !== 2 ? onClick : () => {}}
        />
      )}
      <div className="fb1 fbh fbac lh24" onClick={(e) => titleClick(e)}>
        <div className="omit" title={name}>
          {typeof name === 'object' ? name : t(name)}
        </div>
        <div
          className="fbn"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {icon}
        </div>
        {type === 1 && <div className={c('fb1 ml8', s.dashed)} />}
      </div>
      <div
        className={'fbn'}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {extra}
      </div>
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
  updateKey,
  onClick = () => {},
  onContextMenu = () => {},
}) => {
  if (allSessionIds[sessionId]) {
    console.warn(`'Section'组件有重复的'sessionId(${sessionId})'出现，请检查`)
  }
  const sessionKey = sessionId ? `section-${sessionId}` : undefined
  const [fold, setFold] = useState(sessionKey ? session.get(sessionKey, isFold) : isFold)
  useEffect(() => {
    if (updateKey) {
      setFold(sessionKey ? session.get(sessionKey, isFold) : isFold)
    }
  }, [updateKey])
  return (
    <div className={c(className)} id={id} onContextMenu={onContextMenu}>
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
        titleClick={onClick}
      />
      <div
        className={c('pt8 mr8 scrollbar', childrenClassName, {
          hide: fold,
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default observer(Section)
