import React, {useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import isFunction from 'lodash/isFunction'

const Scroll = ({className, children}) => {
  const el = useRef(null)

  // 对外暴露滚动到id元素的方法
  const scrollTo = (id) => {
    const scrollTarget = el.current.querySelector(id)
    if (scrollTarget) {
      el.current.scrollTop =
        scrollTarget.getBoundingClientRect().y - el.current.getBoundingClientRect().y + el.current.scrollTop
    }
  }

  // 暴露浏览器滚动到底部方法 触底true 不触底false
  const scrollEnd = () => {
    const {scrollHeight, scrollTop, clientHeight} = el.current
    return handler.onScrollEnd(scrollHeight - scrollTop === clientHeight)
  }

  const handler = {
    onScrollEnd() {},
  }

  return (
    <div onScrollCapture={scrollEnd} ref={el} className={c('scrollbar', className)}>
      {isFunction(children) ? children({scrollTo, handler}) : children}
    </div>
  )
}

export default observer(Scroll)
