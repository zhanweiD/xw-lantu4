import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import {session} from '@utils/storage'
import c from 'classnames'
import IconButton from '@components/icon-button'
import s from './tab.module.styl'

const allSessionIds = {}

const Tab = ({
  children = [],
  className,
  headClassName,
  bodyClassName,
  sessionId,
  onSwitch = () => {},
  activeIndex = 0,
}) => {
  const items = [].concat(children)

  if (allSessionIds[sessionId]) {
    console.warn(`'Tab'组件有重复的'sessionId(${sessionId})'出现，请检查`)
  }
  const sessionKey = sessionId ? `tab-${sessionId}` : undefined
  const [currentIndex, setCurrentIndex] = useState(sessionKey ? session.get(sessionKey, activeIndex) : activeIndex)
  items.length
  return (
    <div className={c('fbv', s.root, className)}>
      <div className={c('fbh cfb10', s.head, headClassName)}>
        {items.map((child, index) => {
          const {props = {}} = child
          const {name, icon, hasIcon, onIconClick = () => {}} = props
          return (
            <div
              key={name}
              className={c('fbh fbac hand', s.name, {
                [s.name_active]: index === currentIndex,
                ctw: index === currentIndex,
                ctw40: index !== currentIndex,
              })}
              onClick={() => {
                setCurrentIndex(index)
                sessionKey && session.set(sessionKey, index)
                onSwitch(index)
              }}
            >
              <span>{name}</span>
              <span className="ml4">
                {hasIcon && (
                  <IconButton
                    iconFill={index === currentIndex ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.4)'}
                    icon={icon}
                    buttonSize={14}
                    onClick={onIconClick}
                  />
                )}
              </span>
            </div>
          )
        })}
      </div>
      <div className={c('fb1 oh pr', bodyClassName)}>
        {items.map((child, index) => (
          <Item key={`${child.props.name}.${index}`} currentIndex={index === currentIndex} className={className}>
            {child.props.children}
          </Item>
        ))}
      </div>
    </div>
  )
}

const Item = ({children, currentIndex, className}) => (
  <div
    className={c(
      'wh100p',
      s.content,
      {
        [s.content_active]: currentIndex,
      },
      className
    )}
  >
    {children}
  </div>
)

Tab.Item = Item

export default observer(Tab)
