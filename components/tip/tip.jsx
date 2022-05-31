import React, {createRef} from 'react'
import ReactDOM from 'react-dom'
import c from 'classnames'
import isDef from '@utils/is-def'
import Icon from '@components/icon'
import s from './tip.module.styl'

function Tip() {
  const types = ['info', 'success', 'error', 'warning']
  const messageRef = createRef(null)
  let removeMessageTimer = null

  const globalTip = document.createElement('div')
  globalTip.id = 'globalTip'
  document.getElementById('globalOverlay').appendChild(globalTip)

  // 移除组件
  const removeMessage = () => {
    if (isDef(messageRef) && messageRef.current) {
      // 卸载 react 容器组件，需要指定 parentNode
      ReactDOM.unmountComponentAtNode(messageRef.current.parentNode)
    }
  }

  // 用户点击关闭图标删除消息
  const handleCloseTip = () => {
    clearTimeout(removeMessageTimer)
    removeMessage()
  }

  /**
   * @param {type} 预设的主题类型
   * @param {content} 通知展示的内容，react 元素
   * @param {duration} 显示的事件
   */
  const createMessage = ({type, content, duration, isManuallyClose}) => {
    const themeStyleIndex = isDef(type) && types.indexOf(type)
    const themeStyle = themeStyleIndex < 0 ? types[0] : types[themeStyleIndex]

    ReactDOM.render(
      <div ref={messageRef} className={c(s.message, s[themeStyle])}>
        {isDef(content) && content}
        <div onClick={handleCloseTip} style={{display: isManuallyClose ? 'inline-block' : 'none'}}>
          <Icon name="close" className={s.icon} />
        </div>
      </div>,
      document.getElementById('globalTip')
    )

    clearTimeout(removeMessageTimer)
    removeMessageTimer = setTimeout(() => removeMessage(), duration)
  }

  // 向外暴露的四种方法
  types.forEach((type) => {
    this[type] = ({content = '', duration = 3000, isManuallyClose = false}) => {
      createMessage({type: `${type}`, content, duration, isManuallyClose})
    }
  })
}

// message对象全局唯一
const myTip = new Tip()

export default myTip
