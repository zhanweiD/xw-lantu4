import React, {useState, useEffect, useRef, useLayoutEffect} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {SketchPicker} from 'react-color'
import isDef from '@utils/is-def'
import isNumberic from '@utils/is-numberic'
import uuid from '@utils/uuid'
import s from './gradient.module.styl'
import {Field} from '../base'
import {colorArrayForm, colorObjectForm, getGradientColor} from './gradient-util'

const GradientField = ({
  label,
  value,
  defaultValue = ['rgb(74,144,226)', 'rgb(80,227,194)'],
  onChange = () => {},
  labelClassName,
  childrenClassName,
  className,
}) => {
  const [rect, setRect] = useState({})
  const [circle, setCircle] = useState({})
  const [activeKey, setActiveKey] = useState(null)
  const [canShowPicker, setCanShowPicker] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [rectBackgroundColor, setRectBackgroundColor] = useState()

  const rectRef = useRef()
  const colorPickerBoxRef = useRef()

  const {gradientList = []} = isDef(value) ? colorObjectForm(value) : colorObjectForm(defaultValue)

  /**
   * 渐变项初始化
   * key: 圆点id
   * position: 圆点位置
   * stop: 中间线位置，待做
   */
  const getgradientListInit = () => {
    const listCopy = JSON.parse(JSON.stringify(gradientList))
    listCopy.forEach((item, index) => {
      if (index === 0 && !item.key) {
        item.key = 'g0'
        item.position = 0
        item.stop = 50
      } else if (index === listCopy.length - 1 && !item.key) {
        item.key = 'g1'
        item.position = 1
        item.stop = 50
      }
    })
    return listCopy
  }

  const gradientListInit = getgradientListInit()

  // 获取矩形空间的位置
  useEffect(() => {
    const boundingClientRect = {
      x: rectRef.current.getBoundingClientRect().x,
      y: rectRef.current.getBoundingClientRect().y,
      width: rectRef.current.getBoundingClientRect().width,
    }

    setRect(boundingClientRect)
  }, [])

  // 鼠标拖动圆点
  useEffect(() => {
    const {key, x, y} = circle
    const circleNode = document.querySelector(`.${key}`)

    if (circleNode) {
      // 用于保存小的div拖拽前的坐标
      circleNode.startX = x - circleNode.offsetLeft
      circleNode.startY = y

      // 鼠标的移动事件
      document.onmousemove = (e) => {
        // circleNode.style.left = `${e.clientX - circleNode.startX}px`
        circleNode.style.top = `${e.clientY - circleNode.startY}px`
        // 对于大的DIV四个边界的判断
        if (e.clientX - circleNode.startX <= -4) {
          circleNode.style.left = `${-4}px`
        }
        if (e.clientY - circleNode.startY <= 0) {
          circleNode.style.top = `${-4}px`
        }
        if (e.clientX - circleNode.startX >= rect.width - 7) {
          circleNode.style.left = `${rect.width - 4}px`
        }
        if (e.clientY - circleNode.startY >= 0) {
          circleNode.style.top = `${-4}px`
        }
        let circleX = e.clientX
        if (e.clientX < rect.x) {
          circleX = rect.x
        }
        if (e.clientX > rect.x + rect.width) {
          circleX = rect.x + rect.width
        }
        // 更新颜色位置
        const position = (circleX - rect.x) / rect.width
        const copyList = JSON.parse(JSON.stringify(gradientListInit))
        copyList.find((item) => item.key === key).position = position
        const colors = {gradientList: copyList}
        onChange(colorArrayForm(colors))
      }
      // 鼠标的抬起事件,终止拖动
      document.onmouseup = (e) => {
        // 位置移动后点击事件取消
        if (e.clientX !== x) {
          setIsClick(false)
        }
        document.onmousemove = null
        document.onmouseup = null
        // log.info('mouseup')
      }
    }
  }, [circle])

  // colorPicker显示
  useLayoutEffect(() => {
    if (canShowPicker) {
      // 展示的时候，修改colorPicker的位置，下面如果超出innerHeight， 那就展示在上边
      const colorPickerBoxDom = colorPickerBoxRef.current
      const {top, left} = rectRef.current.getBoundingClientRect()
      const {height} = colorPickerBoxDom.getBoundingClientRect()

      const {innerHeight} = window
      if (top + height + 24 > innerHeight) {
        colorPickerBoxDom.style.top = `${top - height - 8}px`
        colorPickerBoxDom.style.left = `${left}px`
      } else {
        colorPickerBoxDom.style.top = `${top + 24}px`
        colorPickerBoxDom.style.left = `${left}px`
      }
    }
  }, [canShowPicker])

  // 获取渐变色背景
  useEffect(() => {
    const background = getGradientColor(gradientList)
    setRectBackgroundColor(background)
  }, [value])

  const rgba2objMap = (key) => {
    const rgb = gradientListInit.find((o) => o.key === key)
      ? gradientListInit.find((o) => o.key === key).color
      : 'rgba(0, 119, 255, 1)'

    const color = rgb
      .replace(/rgba\(/i, '')
      .replace(/rgb\(/i, '')
      .replace(')', '')
      .split(',')
    const inspectColor =
      rgb.search(/rgb/i) === 0 && color.length > 2
        ? color.map((item) => (isNumberic(item) ? Number(item) : 0))
        : [0, 0, 0, 1]
    return {
      r: inspectColor[0],
      g: inspectColor[1],
      b: inspectColor[2],
      a: inspectColor[3],
    }
  }

  const changeColorMap = (key, rgba) => {
    const copyList = JSON.parse(JSON.stringify(gradientListInit))
    copyList.find((o) => o.key === key).color = rgba
    const colors = {gradientList: copyList}
    return colors
  }

  return (
    <Field className={className} childrenClassName={childrenClassName} labelClassName={labelClassName} label={label}>
      <div className="pr w100p cfw10 h24">
        {/* 用一个fixed的div放在下面，点击这个div时，触发关闭退出编辑状态 */}
        {isEdit && !canShowPicker && (
          <div
            className={s.cover}
            onClick={() => {
              setActiveKey(null)
              setIsEdit(false)
            }}
          />
        )}
        <div
          ref={rectRef}
          className={c('fbh fbac fbjc pa', s.rect)}
          style={{background: rectBackgroundColor}}
          onDoubleClick={(e) => {
            // 阻止事件冒泡
            e.stopPropagation()
            e.preventDefault()

            const position = (e.clientX - rect.x) / rect.width
            const copyList = JSON.parse(JSON.stringify(gradientListInit))
            if (copyList.findIndex((o) => o.position === position) === -1) {
              copyList.push({
                key: `g${uuid()}`,
                position,
                color: 'rgb(0, 119, 255)',
                stop: 50,
                gradientType: 'linear',
              })
              const colors = {gradientList: copyList}
              onChange(colorArrayForm(colors))
            }
            // log.info('doubleClick')
          }}
          onClick={(e) => {
            // 阻止事件冒泡
            e.stopPropagation()
            setActiveKey(null)
            setCanShowPicker(false)
          }}
          tabIndex="-1"
          onFocus={(e) => {
            // 阻止事件冒泡
            e.stopPropagation()
            setIsEdit(true)
          }}
          onBlur={(e) => {
            // 阻止事件冒泡
            e.stopPropagation()
            // console.log(e.relatedTarget)
            if (!canShowPicker && e.relatedTarget && e.relatedTarget.className.indexOf('nodeFocus') === -1) {
              setIsEdit(false)
            }
          }}
        >
          <div className={c('pr w100p', s.baseLine, {hide: !isEdit})}>
            {gradientListInit.map((item) => {
              const {key, position, color} = item
              // TODO 解决onClick与onMouseDown, onMouseUp的冲突
              return (
                <div
                  key={key}
                  className={c('pa nodeFocus', key, s.circle, {
                    [s.activeCircle]: activeKey === key,
                  })}
                  tabIndex={-1}
                  style={{
                    background: color,
                    left: rect.width ? Math.min(rect.width * position - 4, rect.width - 4) : 0,
                  }}
                  draggable={false}
                  onClick={(e) => {
                    // 阻止事件冒泡
                    e.stopPropagation()
                    if (isClick || item.position === 0 || item.position === 1) {
                      // 聚焦
                      e.target.focus()
                      setActiveKey(key)
                      setCanShowPicker(true)
                    }
                    // log.info('click')
                    // 取消鼠标移动事件
                    document.onmousemove = null
                  }}
                  onKeyDown={(e) => {
                    if (item.position === 0 || item.position === 1) {
                      return
                    }
                    // 删除按键
                    if (e.key === 'Backspace' && gradientListInit.length > 2) {
                      const colors = {
                        gradientList: gradientListInit.filter((o) => o.key !== key),
                      }
                      onChange(colorArrayForm(colors))
                      setCanShowPicker(false)
                    }
                  }}
                  onMouseDown={(e) => {
                    if (item.position === 0 || item.position === 1) {
                      return
                    }
                    // 阻止事件冒泡
                    e.stopPropagation()
                    setCircle({key, x: e.clientX, y: e.clientY})
                    setIsClick(true)
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
      {canShowPicker && (
        <div ref={colorPickerBoxRef} className={s.pickerBox}>
          {/* 用一个fixed的div 展示在colorPicker下面，点击这个div时，触发关闭 */}
          <div
            className={s.cover}
            onClick={() => {
              setActiveKey(null)
              setCanShowPicker(false)
              // 关闭picker后重新设置rect为焦点
              rectRef.current.focus()
            }}
          />
          <SketchPicker
            color={rgba2objMap(activeKey)}
            disableAlpha
            onChange={(color) => {
              const rgba = `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`
              onChange(colorArrayForm(changeColorMap(activeKey, rgba)))
            }}
          />
        </div>
      )}
    </Field>
  )
}

export default observer(GradientField)
