import React, {useState, useEffect, useRef, useLayoutEffect} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {SketchPicker} from 'react-color'
import isNumberic from '@utils/is-numberic'
import uuid from '@utils/uuid'
import IconButton from '@components/icon-button'
import s from './colorList.module.styl'
import {Field} from '../base'
import {colorArrayForm, colorObjectForm, getGradientColor} from './gradient-util'

const ColorListField = ({
  label,
  visible,
  value,
  defaultValue = [[['rgba(52,200,254,1)', 0]]],
  onChange = () => {},
  labelClassName,
  childrenClassName,
  className,
}) => {
  const [rect, setRect] = useState({})
  const [circle, setCircle] = useState({})
  const [canShowPicker, setCanShowPicker] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState() // 渐变条背景色
  const [colorList, setColorList] = useState(value || defaultValue)
  const [nowIndex, setNowIndex] = useState(0)
  // 当前选择的色块颜色值是否是渐变
  const [gradientList, setGradientList] = useState()
  const [activeColor, setActiveColor] = useState(colorList[0]) // 当前编辑色块
  const [activeKey, setActiveKey] = useState(activeColor[0][2] || 'g0') // 渐变圆点key // 当前色块选中的颜色key
  const rectRef = useRef()
  const colorRef = useRef()
  const colorPickerBoxRef = useRef()

  /**
   * 渐变项初始化
   * key: 圆点id
   * position: 圆点位置
   * stop: 中间线位置，待做
   */
  const getgradientListInit = (colorObj) => {
    const listCopy = JSON.parse(JSON.stringify(colorObj))
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

  // 鼠标拖动圆点
  useEffect(() => {
    const {key, x, y} = circle
    const circleNode = document.querySelector(`.${key}`)
    if (circleNode && key) {
      // 用于保存小的div拖拽前的坐标
      circleNode.startY = y - circleNode.offsetTop
      circleNode.startX = x
      // 鼠标的移动事件
      document.onmousemove = (e) => {
        let circleY = e.clientY
        if (e.clientY < rect.y) circleY = rect.y
        if (e.clientY > rect.y + rect.height) circleY = rect.y + rect.height
        // 更新颜色位置
        const position = (circleY - rect.y) / rect.height
        const copyList = JSON.parse(JSON.stringify(gradientList))
        copyList.find((item) => item.key === key).position = position
        const colors = {gradientList: copyList}
        setActiveColor(colorArrayForm(colors))
      }
      // 鼠标的抬起事件,终止拖动
      document.onmouseup = (e) => {
        // 位置移动后点击事件取消
        if (e.clientY !== y) setIsClick(false)
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }, [circle])

  // colorPicker显示
  useLayoutEffect(() => {
    if (canShowPicker) {
      // 展示的时候，修改colorPicker的位置，下面如果超出innerHeight， 那就展示在上边
      const colorPickerBoxDom = colorPickerBoxRef.current
      const {top, left} = colorRef.current.getBoundingClientRect()
      const {height} = colorPickerBoxDom.getBoundingClientRect()
      const {innerHeight} = window
      if (top + height + 24 > innerHeight) {
        colorPickerBoxDom.style.top = `${top - height - 8}px`
        colorPickerBoxDom.style.left = `${left - 60}px`
      } else {
        colorPickerBoxDom.style.top = `${top + 24}px`
        colorPickerBoxDom.style.left = `${left - 60}px`
      }
      const boundingClientRect = {
        x: rectRef.current.getBoundingClientRect().x,
        y: rectRef.current.getBoundingClientRect().y,
        height: rectRef.current.getBoundingClientRect().height,
      }
      setRect(boundingClientRect)
    }
  }, [canShowPicker])

  // 获取渐变色背景
  useEffect(() => {
    const colorObj = colorObjectForm(activeColor).gradientList
    setGradientList(getgradientListInit(colorObj))
    setBackgroundColor(getGradientColor(colorObj))

    const copyColorList = [...colorList]
    copyColorList.splice(nowIndex, 1, activeColor)
    setColorList(copyColorList)
  }, [activeColor])

  const rgba2objMap = (key) => {
    const rgb = gradientList.find((o) => o.key === key)
      ? gradientList.find((o) => o.key === key).color
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

  // 根据key更新对应color（copy并非真实）
  const changeColorMap = (key, rgba) => {
    const copyList = JSON.parse(JSON.stringify(gradientList))
    copyList.find((o) => o.key === key).color = rgba
    const colors = {gradientList: copyList}
    return colors
  }

  // 更新activeKey对应的color
  const updateActiveColor = (color) => {
    const rgba = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b}, ${color.rgb.a})`
    setActiveColor(colorArrayForm(changeColorMap(activeKey, rgba)))
  }
  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      labelClassName={labelClassName}
      label={label}
      visible={visible}
    >
      <div
        className={`${s.colorListBox} fbh`}
        ref={colorRef}
        onClick={(e) => {
          // 阻止事件冒泡
          e.stopPropagation()
          // 取消鼠标移动事件
          document.onmousemove = null
        }}
      >
        {/* colorList */}
        {colorList.map((item, index) => {
          return (
            <div
              key={uuid()}
              className={`${s.colorBox} p4 pr hand`}
              onClick={() => {
                setCanShowPicker(true)
                setNowIndex(index)
                setActiveColor(item)
              }}
            >
              <div className="w24 h16" style={{background: getGradientColor(colorObjectForm(item).gradientList)}} />
              <IconButton
                icon="close"
                className={s.iconDel}
                iconSize={8}
                buttonSize={10}
                onClick={(e) => {
                  e.stopPropagation()
                  const list = [...colorList]
                  list.splice(index, 1)
                  setColorList(list)
                  setCanShowPicker(false)
                  onChange(list)
                }}
              />
            </div>
          )
        })}
        <IconButton
          icon="add"
          iconSize={14}
          buttonSize={24}
          onClick={() => {
            setColorList([...colorList, [['rgba(52,200,254,1)', 0]]])
            onChange([...colorList, [['rgba(52,200,254,1)', 0]]])
          }}
        />
      </div>

      {/* colorList 激活item的配置 */}
      {canShowPicker && (
        <div className="pr colorList">
          <div ref={colorPickerBoxRef} className={s.pickerBox}>
            <SketchPicker color={rgba2objMap(activeKey)} onChange={updateActiveColor} />
            <div className={`${s.rectBox} cfw10`}>
              <div
                ref={rectRef}
                className={c('fbh fbac fbjc pa', s.rect)}
                style={{background: backgroundColor}}
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  const position = (e.clientY - rect.y) / rect.height
                  const copyList = JSON.parse(JSON.stringify(gradientList))
                  if (copyList.findIndex((o) => o.position === position) === -1) {
                    const item = {
                      key: `g${uuid()}`,
                      position,
                      color: 'rgba(0, 119, 255, 1)',
                      stop: 50,
                      gradientType: 'linear',
                    }
                    copyList.push(item)
                    const colors = {gradientList: copyList}
                    setActiveColor(colorArrayForm(colors))
                    setActiveKey(item.key)
                  }
                }}
                tabIndex="-1"
              >
                <div className={c('pr', s.baseLine)}>
                  {gradientList.map((item) => {
                    const {key, position, color} = item
                    return (
                      <div
                        key={key}
                        className={c('pa nodeFocus', key, s.circle, {
                          [s.activeCircle]: activeKey === key,
                        })}
                        tabIndex={-1}
                        style={{
                          background: color,
                          top: rect.height ? rect.height * position : 0,
                        }}
                        draggable={false}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isClick) {
                            // 聚焦
                            e.target.focus()
                            setActiveKey(key)
                          }
                          document.onmousemove = null
                        }}
                        onKeyDown={(e) => {
                          // 删除按键
                          if (e.key === 'Backspace' && gradientList.length > 1) {
                            const colors = {
                              gradientList: gradientList.filter((o) => o.key !== key),
                            }
                            const newColor = colorArrayForm(colors)
                            setActiveColor(newColor)
                            setActiveKey(newColor[0][2])
                          }
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation()
                          setActiveKey(key)
                          setCircle({key, x: e.clientX, y: e.clientY})
                          // TODO 解决onClick与onMouseDown, onMouseUp的冲突
                          setIsClick(true)
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            </div>

            <div className={`${s.btmButton}`}>
              <div
                className={`${s.btnLeft} hand`}
                onClick={() => {
                  setCanShowPicker(false)
                  setColorList(value)
                }}
              >
                取消
              </div>
              {/* 只在确定时调用onChange更新colorList */}
              <div
                className={`${s.btnRight} hand`}
                onClick={() => {
                  onChange(colorList)
                  setCanShowPicker(false)
                }}
              >
                确认
              </div>
            </div>
          </div>
        </div>
      )}
    </Field>
  )
}

export default observer(ColorListField)
