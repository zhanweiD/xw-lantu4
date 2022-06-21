import React from 'react'
import c from 'classnames'
import {observer} from 'mobx-react-lite'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import s from './switch.module.styl'

const MSwitch = MUIBase.named('MSwitch')
  .props({
    value: types.optional(types.boolean, true),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'uiSwitch'
    }
    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.draw({redraw: false})
    }

    // 传入默认值
    const data = (switchData) => {
      self.value = switchData?.defaultValue
    }
    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }
      const style = {
        height: self.config('height'),
        width: self.config('width'),
        pointColor: self.config('pointColor'),
        pointSize: self.config('pointSize'),
        radius: self.config('radius'),
        activeBackgroundColor: self.config('activeColor'),
        inactiveBackgroundColor: self.config('inactiveColor'),
      }
      // 自适应容器
      if (self.config('adaptContainer')) {
        Object.assign(style, {
          width: self.containerWidth,
          height: self.containerHeight,
        })
      }

      // 渲染组件
      self.render(<Switch value={self.value} onChange={self.onChange} style={style} />)
    }

    const onChange = (value) => {
      self.value = value
      self.draw({redraw: false})
      console.log(value)
      self.event.fire('onToggleSwitch', {
        data: value,
      })
    }

    const toggleSwitch = (value) => {
      typeof value === 'boolean' && (self.value = value)
      self.draw({redraw: false})
    }
    return {
      data,
      draw,
      drawFallback,
      afterCreate,
      onChange,
      toggleSwitch,
    }
  })

const Switch = observer(({value, onChange, style}) => {
  const {pointColor, pointSize, radius, activeBackgroundColor, inactiveBackgroundColor, height, width} = style
  const pointStyle = {
    backgroundColor: pointColor,
    width: pointSize,
    height: pointSize,
  }
  const containerStyle = {
    width,
    height,
    borderRadius: radius,
    background: value ? activeBackgroundColor : inactiveBackgroundColor,
    justifyContent: value ? 'flex-end' : 'flex-start',
  }

  return (
    <div className={c(s.switch)} style={containerStyle} onClick={() => onChange(!value)}>
      <div style={pointStyle} className={s.point} />
    </div>
  )
})

export default MSwitch
