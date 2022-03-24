import React, {useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import s from './tab.module.styl'

const TabScroll = ({children = [], className, headClassName, bodyClassName, activeKey, onChange = () => {}}) => {
  const items = [].concat(children.filter ? children.filter((child) => !!child) : children)
  useEffect(() => {
    console.log('TabScroll', activeKey)
  }, [activeKey])
  return (
    <div className={c('fbv', s.root, className)}>
      <div className={c('fbh cfb10', s.head, headClassName)}>
        {/* <IconButton buttonSize={32} iconSize={12} icon="arrow-left"/> */}
        <div className={c('fb1 fbh', s.name_box)}>
          {items.map((child) => {
            const {props = {}} = child
            const {name, itemKey} = props
            return (
              <div
                key={itemKey}
                className={c('fbh fbac hand', s.name, {
                  [s.name_active]: itemKey === activeKey,
                  ctw: activeKey === itemKey,
                  ctw40: activeKey !== itemKey,
                })}
                onClick={() => {
                  onChange && onChange(itemKey)
                }}
              >
                <span>{name}</span>
              </div>
            )
          })}
        </div>
        {/* <IconButton buttonSize={32} iconSize={12} icon="arrow-right"/> */}
      </div>
      <div className={c('fb1 oh pr', bodyClassName)}>
        {items.map((child) => {
          const {props = {}} = child
          const {itemKey} = props
          return (
            <Item key={itemKey} currentIndex={itemKey === activeKey} className={className}>
              {child.props.children}
            </Item>
          )
        })}
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

TabScroll.Item = Item

export default observer(TabScroll)
