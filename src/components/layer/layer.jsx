import React, {useEffect, useState, useRef} from "react"
import ReactDOM from "react-dom"
import {observer} from "mobx-react-lite"
// import isFunction from 'lodash/isFunction'
import c from "classnames"
// import {globalEvent} from '../../common/event'
import isDef from "@utils/is-def"
import s from "./layer.module.styl"

let hideLayer
// globalEvent.on('globalClick', e => {
// if (isFunction(hideLayer) && e.target.closest('.layer-box') === null) {
//   hideLayer()
// }
// })

// top bottom同时设置的优先级高于height
// left right同时设置的优先级高于width
// isFullScreen的优先级最高

//   <Layer top={20} right={20} width={300} height={100} isVisible={true}>
//   <div className="w100p h100p" style={{backgroundColor: testColor}}>1</div>
//   </Layer>

//   <Layer top={20} bottom={20} width={200} isVisible={true}>
//   <div className="w100p h100p" style={{backgroundColor: testColor}}>3</div>
//   </Layer>

//   <Layer top={20} left={20} width={200} height={100} isVisible={true}>
//   <div className="w100p h100p" style={{backgroundColor: testColor}}>2</div>
//   </Layer>

//   <Layer isFullScreen={true} isVisible={true}>
//   <div className="w100p h100p" style={{backgroundColor: testColor}}>4</div>
//   </Layer>

//   <Layer right={20} bottom={20} width={200} height={100} isVisible={true}>
//   <div className="w100p h100p" style={{backgroundColor: testColor}}>5</div>
//   </Layer>

//   <Layer left={20} bottom={20} width={200} height={100} isVisible={true}>
//   <div className="w100p h100p" style={{backgroundColor: testColor}}>6</div>
//   </Layer>

//   <Layer width={400} height={300} isVisible={true}>
//   <div className="w100p h100p" style={{backgroundColor: testColor}}>7</div>
//   </Layer>

//   <Layer left={20} right={20} height={200} isVisible={true}>
//   <div className="w100p h100p" style={{backgroundColor: testColor}}>8</div>
//   </Layer>

//   NOTE 吸附到指定的元素，根据元素进行定位，内置边缘检测
//   <Layer attachToElement={elementRef.current} isVisible={true}>
//     <div className="w100p h100p" style={{backgroundColor: testColor}}>8</div>
//   </Layer>

const LayerBox = observer(
  ({
    top,
    right,
    bottom,
    left,
    width,
    height,
    isVisible,
    isFullScreen,
    attachToElement,
    hideWhenOutsideClick,
    className,
    children,
    canHideLayer
  }) => {
    const boxRef = useRef(null)
    const [autoHeight, setAutoHeight] = useState(undefined)

    useEffect(() => {
      setAutoHeight(boxRef.current.clientHeight)
    })

    // console.log('🌈')
    // console.log('top', top)
    // console.log('left', left)
    // console.log('bottom', bottom)
    // console.log('right', right)
    // console.log('width', width)
    // console.log('height', height)

    const hasAttachToElement = isDef(attachToElement)
    const hasTop = isDef(top)
    const hasRight = isDef(right)
    const hasBottom = isDef(bottom)
    const hasLeft = isDef(left)
    const hasWidth = isDef(width)
    const hasHeight = isDef(height)
    const hiddenTop = -1000000
    const hiddenLeft = -1000000

    // 初始化
    const style = {}

    // 是否可见
    if (isVisible) {
      if (hasAttachToElement) {
        if (!hasWidth) {
          throw new Error(
            "Layer组件如果指定了attachToElement属性，则必须同时传入width属性"
          )
        }

        style.width = width

        // 如果指定了吸附元素，则忽略top, right, bottom, left, width, isFullScreen
        const {
          left: elementLeft,
          top: elementTop,
          bottom: elementBottom,
          right: elementRight
        } = attachToElement.getBoundingClientRect()
        // console.log('elementRef.current.getBoundingClientRect()', elementRef.current.getBoundingClientRect())

        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        if (elementLeft + width > windowWidth) {
          style.left = undefined
          style.right = windowWidth - elementRight
        } else {
          style.left = elementLeft
          style.right = undefined
        }

        if (elementBottom + autoHeight > windowHeight) {
          style.top = undefined
          style.bottom = windowHeight - elementTop
        } else {
          style.top = elementBottom
          style.bottom = undefined
        }
      } else if (isFullScreen) {
        style.width = "100%"
        style.height = "100%"
        style.top = 0
        style.left = 0
        style.bottom = 0
        style.right = 0
      } else {
        style.width = hasLeft && hasRight ? "auto" : `${width}px`
        style.height = hasTop && hasBottom ? "auto" : `${height}px`
        style.top = hasTop
          ? `${top}px`
          : hasBottom && hasHeight
          ? "auto"
          : "50%"
        style.left = hasLeft
          ? `${left}px`
          : hasRight && hasWidth
          ? "auto"
          : "50%"
        style.bottom = hasBottom ? `${bottom}px` : "auto"
        style.right = hasRight ? `${right}px` : "auto"

        // 补充
        if (style.top === "50%") {
          style.transform = "translateY(-50%)"
        }

        // 补充
        if (style.left === "50%") {
          style.transform = `${style.transform || ""} translateX(-50%)`
        }
      }

      if (hideWhenOutsideClick === true) {
        // 告诉上一层可以关闭
        canHideLayer(true)
      }
    } else {
      style.top = hiddenTop
      style.left = hiddenLeft
      style.right = undefined
      style.bottom = undefined

      if (hideWhenOutsideClick === true) {
        canHideLayer(false)
      }
    }

    return (
      <div
        ref={boxRef}
        className={c("layer-box", s.layer, className)}
        style={style}
      >
        {children}
      </div>
    )
  }
)

// Layer组件
const Layer = ({
  // 影响样式计算的props
  top,
  right,
  bottom,
  left,
  width,
  height,
  isVisible = false,
  isFullScreen = false,
  attachToElement,
  hideWhenOutsideClick = true,
  className,
  hasMask = false,
  onMaskClick = () => {},
  onOutsideClick = () => {},
  children,
  log
}) => {
  const [isLayerBoxVisible, setIsLayerBoxVisible] = useState(isVisible)
  useEffect(() => {
    setIsLayerBoxVisible(isVisible)
  }, [isVisible])

  return ReactDOM.createPortal(
    <div className={c(s.root)}>
      {hasMask && <div className={c(s.mask)} onClick={onMaskClick} />}
      <LayerBox
        top={top}
        right={right}
        bottom={bottom}
        left={left}
        width={width}
        height={height}
        isVisible={isLayerBoxVisible}
        isFullScreen={isFullScreen}
        attachToElement={attachToElement}
        hideWhenOutsideClick={hideWhenOutsideClick}
        className={className}
        canHideLayer={(can) => {
          hideLayer === can
            ? () => {
                setIsLayerBoxVisible(false)
                onOutsideClick()
              }
            : undefined
        }}
        log={log}
      >
        {children}
      </LayerBox>
    </div>,
    document.getElementById("globalOverlay")
  )
}

export default observer(Layer)
