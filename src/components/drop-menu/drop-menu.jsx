// TODO 弃用，使用menu替换

// !!! 未来需要弃用，改成其他实现方式
import React, {Children, useRef, useState, useEffect} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import isDef from "@utils/is-def"
import {globalEvent} from "@utils/create-event"
import s from "./drop-menu.module.styl"

/**
 * DropMenu 组件设计思路
 * - 激活下拉方式：鼠标hover、点击onclick
 * - 容器：自定义children、默认text类型
 * - 参数：
 *
 * @param
 *{
 *  text      // 下拉按钮文字：当没有text则显示children
 *  onClick   // 是否为点击下拉：当没有onClick时为hover方式
 *  item: [{  // 下拉列表
 *    name       // 下拉项名称
 *    endLine    // 本条是否含分割线
 *    action     // 点击后执行的方法
 *  }]
 * }
 *
 * @example
 * <DropMenu item={[{name: '个人中心', endLine: true}, {action: () => {}, name: '退出登录'}]}>Hover我下拉</DropMenu>
 */
const DropMenu = ({
  children,
  items = [],
  name,
  user,
  description,
  onClick = () => {}
}) => {
  const ref = useRef()
  const hasItems = isDef(items)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    globalEvent.on("globalClick", (e) => {
      if (e.target.closest(".dropMenu") === null) {
        user.hideDropMenu(true)
      }
    })
  }, [])
  useEffect(() => {
    if (ref) {
      setWidth(ref.current.clientWidth)
    }
  })
  // 捕捉鼠标移入移出事件
  return (
    <div className="dropMenu" ref={ref}>
      <div
        onClick={() => {
          user.hideDropMenu(!user.isHideDropMenu)
        }}
      >
        {children}
      </div>
      <div
        className={c({hide: user.isHideDropMenu}, s.dropMenu)}
        style={{width}}
      >
        {description && (
          <div className={c(s.descriptionBox, s.endLine)}>
            {name && <div className={c("fs14", s.name)}>{name}</div>}
            <div className={c("fs12", s.description)}>{description}</div>
          </div>
        )}
        {/* 鼠标点击关闭下拉区域 */}
        <div className={c("drop-menu", "fbv", s.endLine)}>
          {hasItems &&
            items
              .filter((v) => v.name)
              .map((item) =>
                Children.toArray(
                  <div
                    className={c(s.item, "omit", {
                      [s.endLine]: item.endLine,
                      [s.disabled]: item.disabled
                    })}
                    onClick={() => {
                      !item.disabled && item.action && item.action(item)
                      onClick(item)
                    }}
                  >
                    {item.name || ""}
                  </div>
                )
              )}
        </div>
      </div>
    </div>
  )
}

export default observer(DropMenu)
