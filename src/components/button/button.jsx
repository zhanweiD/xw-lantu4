import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import s from './button.module.styl'

/**
 * button 组件设计思路
 * @param {string} name  按钮内容
 * @param {string} type  按钮类型：primary、default、dashed、text
 * @param {string} size  按钮大小：large、small、default
 * @param {boolean} block 按钮是否适应父容器大小
 * @param {boolean} circle 按钮是否圆角
 * @param {number} width 按钮是否自定义宽度
 * @example <Button type="primary" ></Button>
    const Button = ({name, className, onClick}) => (
 */
const Button = ({
  name,
  color,
  type = 'default',
  lineHeight = 26,
  className,
  onClick,
  onMouseDown,
  size = 'small',
  block,
  width,
  circle = 4,
  danger,
  children,
  disabled,
  title,
}) => {
  const style = {width: 'fit-content'}
  block && (style.width = '100%')
  width && (style.width = `${width}px`)
  circle && (style.borderRadius = Number(circle) ? `${circle}px` : '14px')
  danger && (style.background = 'red')
  lineHeight && (style.lineHeight = `${lineHeight}px`)
  color && (style.color = `${color}`)
  return (
    <div
      className={c(
        'cf3 fbh fbac pl16 pr16',
        s.button,
        {
          [s.primary]: type === 'primary',
          [s.default]: type === 'default',
          [s.cancel]: type === 'cancel',
          [s.dashed]: type === 'dashed',
          [s.text]: type === 'text',
          [s.defaultSize]: size === 'default',
          [s.smallSize]: size === 'small',
          [s.largeSize]: size === 'large',
          [s.disabled]: disabled,
        },
        className
      )}
      title={title}
      style={style}
      onClick={disabled ? null : onClick}
      onMouseDown={onMouseDown}
    >
      {name || children}
    </div>
  )
}

export default observer(Button)
