// TODO 弃用，使用overlay替换

import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import IconButton from "@components/icon-button"
import Layer from "@components/layer"
import s from "./modal.module.styl"

// TODO: z-index 不必现式传入, 可选择className扩展方式传入
// Modal组件
const Modal = ({
  top,
  right,
  bottom,
  left,
  width,
  height,
  onClose,
  className,
  isVisible = false,
  title,
  children,
  footer = null,
  isShade = true,
  hideIconClose = false,
  onOutsideClick = () => {}
}) => (
  <>
    <div className={c(s.moadlMask, isShade && "cfb50", !isVisible && "hide")} />
    <Layer
      top={top}
      right={right}
      left={left}
      bottom={bottom}
      width={width}
      height={height}
      isVisible={isVisible}
      className={s.layer}
      // TODO 暂时取消框外点击隐藏，当前点击隐藏未更改显隐状态
      hideWhenOutsideClick={!isShade}
      hideIconClose={hideIconClose}
      onOutsideClick={() => {
        onOutsideClick()
      }}
    >
      <div className={c("cf3 h100p ctw84 fbv")}>
        <div className="fbh fbac cf2a p8 fbn">
          <div className="fb1 fs14">{title}</div>
          {!hideIconClose && (
            <IconButton icon="close" iconSize={16} onClick={onClose} />
          )}
        </div>
        <div className={c("p28 pt24 pb24 fb1", className)}>{children}</div>
        {footer && <div className={c("fbn cfb", s.footer)}>{footer}</div>}
      </div>
    </Layer>
  </>
)

export default observer(Modal)
