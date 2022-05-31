import React from 'react'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'

const MDecoration = MUIBase.named('MPointDecoration')
  .props({
    decorationData: types.optional(types.frozen(), {}),
  })
  .actions((self) => {
    // 传入数据
    const data = (decorationData) => {
      self.decorationData = decorationData
    }
    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.draw({redraw: false})
    }
    // 绘画组件
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }
      self.color = self.config('colors')
      self.dur = self.config('dur')
      self.shape = self.config('shape')
      const style = {
        height: self.config('height'),
        width: self.config('width'),
      }
      //渲染组件
      self.render(<decoration style={style} dur={self.dur} shape={self.shape} />)
    }
    return {
      data,
      draw,
      drawFallback,
    }
  })
export default MDecoration
