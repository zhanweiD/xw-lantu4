import React, {useState} from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import s from "./base.module.styl"
import IconButton from "../icon-button"

export const FieldProcessorButton = observer(
  ({useProcessor, updateProcessor, hasSaveCode, className}) => {
    const [isButtonHover, setIsButtonHover] = useState(false)
    const w = window.waveview

    return (
      <IconButton
        className={c(
          "pa",
          {[s.field_processorOpen]: hasSaveCode, cfw10: !hasSaveCode},
          className
        )}
        icon={useProcessor || !hasSaveCode ? "function" : "disabled-function"}
        buttonSize={24}
        iconFill={
          isButtonHover || hasSaveCode
            ? "rgba(255,255,255,1)"
            : "rgba(255,255,255,0.5)"
        }
        onClick={(e) => {
          e.stopPropagation()
          const modal = w.overlayManager.get("dataProcessor")
          modal.show({
            attachTo: false,
            title: "处理函数"
          })
          updateProcessor("code")
        }}
        onMouseOver={(e, currentRef) => {
          e.stopPropagation()
          const menu = w.overlayManager.get("menu")

          // processorCode保存过且menu不显示时才能触发显示
          !menu.isVisible &&
            hasSaveCode &&
            menu.toggle({
              attachTo: currentRef,
              hasMask: false,
              list: [
                !useProcessor
                  ? {
                      // useProcessor: false
                      name: "启用",
                      action: () => {
                        updateProcessor("status")
                      }
                    }
                  : {
                      // useProcessor: true
                      name: "禁用",
                      action: () => {
                        updateProcessor("status")
                      }
                    }
              ]
            })
          setIsButtonHover(true)
        }}
        onMouseOut={(e, currentRef) => {
          e.stopPropagation()
          // 移到菜单区域不隐藏
          const isInSelectRange =
            e.clientX > currentRef.getBoundingClientRect().x - 32 &&
            e.clientX < currentRef.getBoundingClientRect().x + 28 &&
            e.clientY > currentRef.getBoundingClientRect().y - 100 &&
            e.clientY < currentRef.getBoundingClientRect().y + 100
          if (!isInSelectRange) {
            w.overlayManager.get("menu").hide({})
          }
          setIsButtonHover(false)
        }}
      />
    )
  }
)
