import React, {useLayoutEffect, useRef, useState} from "react"
import ReactDOM from "react-dom"
import {observer} from "mobx-react-lite"
import c from "classnames"
import Scroll from "@components/scroll"
import IconButton from "@components/icon-button"
import s from "./overlay.module.styl"

const Overlay = ({model, className, children, onClose = () => {}, buttons = [], isScroll = true, zIndex, contentClassName}) => {
  const boxRef = useRef(null)
  const titleRef = useRef(null)
  const buttonList = model.buttons || buttons
  const [isMaskVisible, setIsMaskVisible] = useState(false)

  useLayoutEffect(() => {
    if (model.isVisible) {
      model.set("autoHeight", boxRef.current.clientHeight)
      if (model.hideWhenOutsideClick || model.hasMask) {
        setIsMaskVisible(true)
      }
    } else {
      setIsMaskVisible(false)
    }
  }, [model.isVisible])

  useLayoutEffect(() => {
    if (model.canDrag) {
      model.initDrag({
        handler: boxRef.current,
        target: boxRef.current
      })
    }
  }, [model.id])

  return ReactDOM.createPortal(
    <div id={model.id} className={c(s.root, {[s.cover]: model.hasMask && isMaskVisible})} style={{zIndex}}>
      <div ref={boxRef} className={c("layerBox", "stopPropagation", s.layerBox, className)} style={model.style}>
        <div className={c("h100p fbv", s.content, contentClassName)} style={model.contentStyle}>
          {/* title */}
          {model.title && (
            <div ref={titleRef} className={c("fbh fbac", s.title)}>
              <div className="fb1 pl8">{model.title}</div>
              {model.closable && (
                <IconButton
                  icon="close"
                  iconSize={14}
                  title="关闭"
                  onClick={() => {
                    onClose()
                    model.hide()
                  }}
                />
              )}
            </div>
          )}
          {/* content */}
          {isScroll ? <Scroll className="fb1">{children || model.content}</Scroll> : children || model.content}
          {buttonList.length > 0 && (
            <div className={c("fbh fbje", s.buttonWrapper)}>
              {buttonList.map((button, index) => {
                return (
                  <div
                    key={button.name}
                    className={c("h32 lh32 hand pl16 pr16", s.button, {
                      cfw2: buttonList.length - 3 === index,
                      cfw6: buttonList.length - 2 === index,
                      cfw10: buttonList.length - 1 === index
                    })}
                    onClick={() => {
                      button.action()
                    }}
                  >
                    {button.name}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById("globalOverlay")
  )
}

export default observer(Overlay)
