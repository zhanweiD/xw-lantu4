import React from 'react'
import {observer} from 'mobx-react-lite'
import {MUIBase} from '../ui-base'
import Dott from './dott'

const Dot = MUIBase.named('Dot')
  .props()
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'zDot'
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.draw({redraw: false})
    }

    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      console.log('self000', self)
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }

      const style = {}
      ;['rectFillColor', 'rectSize', 'rectOpacity'].forEach((name) => (style[name] = self.config(name)))

      // 渲染组件
      self.render(<DotComponent style={style} />)
    }

    return {
      draw,
      // onChange,
      // toggleSwitch,
      drawFallback,
      afterCreate,
    }
  })

const DotComponent = observer(({value, onChange, style}) => {
  console.log('value', value, 'observer', onChange, '监听变化style', style)
  const {rectFillColor, rectSize, rectOpacity} = style
  const dotStyle = {
    rectFillColor,
    rectSize,
    rectOpacity,
  }

  return (
    <div>
      <Dott dotStyle={dotStyle} />
    </div>
  )
})

export default Dot
