import React from 'react'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import s from './input.module.styl'

const MInput = MUIBase.named('MInput')
  .props({
    text: types.maybe(types.string),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'uiInput'
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

      const style = {
        height: self.config('height'),
        width: self.config('width'),
        color: self.config('fontColor'),
        fontSize: self.config('fontSize'),
        backgroundColor: self.config('backgroundColor'),
      }
      // ['width', 'height', 'fontSize', 'color', 'backgroundColor'].forEach(name => {
      //     style[name] = self.config(name)
      // })

      // 自适应容器
      if (self.config('adaptContainer')) {
        Object.assign(style, {
          width: self.containerWidth,
          height: self.containerHeight,
        })
      }

      // 渲染组件
      self.render(
        <input
          className={s.input}
          value={self.text}
          onChange={self.onChange}
          placeholder={self.config('placeholder')}
          // style={{ ...style, padding: `0 ${style.fontSize}px` }}
          style={style}
        />
      )
    }

    // 改变 input 内容
    const onChange = (e) => {
      self.event.fire('onChangeInputValue', {data: e.target.value})
      self.text = e.target.value
    }

    return {
      draw,
      onChange,
      drawFallback,
      afterCreate,
    }
  })

export default MInput
