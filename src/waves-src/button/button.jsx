import React, {useState} from 'react'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import {observer} from 'mobx-react-lite'
import s from './button.module.styl'

const MButton = MUIBase.named('MInput')
  .props({
    name: types.optional(types.string, '按钮'),
    buttonData: types.optional(types.frozen(), {}),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'uiButton'
    }

    // 传入数据
    const data = (buttonData) => {
      self.buttonData = buttonData
      self.name = buttonData.name || self.config('buttonName')
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.draw({redraw: false})
    }

    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }
      self.name = self.config('buttonName')
      const style = {
        height: self.config('height'),
        width: self.config('width'),
        color: self.config('fontColor'),
        fontSize: self.config('height') > self.config('width') ? self.config('height') / 6 : self.config('width') / 6,
        backgroundColor: self.config('backgroundColor'),
        borderRadius: self.config('borderRadius'),
        borderWidth: self.config('borderWidth'),
        borderColor: self.config('borderColor'),
        focusColor: self.config('focusColor'),
        shadowColor: self.config('shadowColor'),
        shadowWidth: self.config('shadowWidth'),
        shadowFuzziness: self.config('shadowFuzziness'),
      }

      // 渲染组件
      self.render(<MyButton self={self} style={style} />)
    }

    return {
      data,
      draw,
      drawFallback,
      afterCreate,
    }
  })

const MyButton = observer(({self, style}) => {
  const {borderWidth, borderColor, focusColor, shadowColor, shadowFuzziness, shadowWidth, ...others} = style
  const [keyDown, setKeyDown] = useState(false)
  const [curShadowFuzziness, setCurShadowFuzziness] = useState(shadowFuzziness)
  const [btnShadowColor, setBtnShadowColor] = useState(false)

  let count = 0,
    timer = null

  // 通过单击，记录模拟双击
  const onClick = (e) => {
    setCurShadowFuzziness(8)
    setBtnShadowColor('rgb(3, 68, 112)')
    setKeyDown(true)
    count++
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      if (count === 1) {
        self.event.fire('click', {data: self.buttonData, e})
      } else {
        self.event.fire('doubleClick', {data: self.buttonData, e})
      }
      count = 0
      timer = null
      setCurShadowFuzziness(2)
      setBtnShadowColor(shadowColor)
    }, 200)
  }

  document.getElementsByTagName('body')[0].onclick = function () {
    setKeyDown(false)
  }

  return (
    <div
      className={keyDown ? s.btn2 : s.button}
      onClick={onClick}
      style={{
        ...others,
        border: `${borderWidth}px solid ${keyDown ? focusColor : borderColor}`,
        boxShadow: `${btnShadowColor} 0px 0px ${curShadowFuzziness}px ${shadowWidth}px`,
      }}
    >
      {self.name}
    </div>
  )
})

export default MButton
