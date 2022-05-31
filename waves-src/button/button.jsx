import React from 'react'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
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
        fontSize: self.config('fontSize'),
        backgroundColor: self.config('backgroundColor'),
        borderRadius: self.config('borderRadius'),
        border: `${self.config('borderWidth')}px solid ${self.config('borderColor')}`,
      }
      // 自适应容器
      // if (self.config('adaptContainer')) {
      // Object.assign(style, {
      //   width: self.containerWidth,
      //   height: self.containerHeight,
      // })
      // }

      // 渲染组件
      self.render(
        <div className={s.button} onClick={self.onClick} style={style}>
          {self.name}
        </div>
      )
    }

    let count = 0,
      timer = null

    // 通过单击，记录模拟双击
    const onClick = (e) => {
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
      }, 200)
    }

    return {
      data,
      draw,
      onClick,
      drawFallback,
      afterCreate,
    }
  })

export default MButton
