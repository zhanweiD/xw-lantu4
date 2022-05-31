import React, {Children, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {sum} from 'd3'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import s from './ui-tab-button.module.styl'
// import {EmptyAnimation} from '../base/animation'

const MCheck = MUIBase.named('MInput')
  .props({
    active: types.optional(types.number, 0),
    options: types.optional(types.array(types.frozen()), []),
  })
  .views((self) => ({
    get nextActive() {
      return (self.active + 1) % self.options.length
    },
  }))
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'uiTabButton'
    }

    // 传入数据
    const data = (options) => {
      self.options = options
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.options = [{key: ''}, {key: ''}, {key: ''}]
      self.draw({redraw: false})
    }

    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }

      const style = {}
      ;['width', 'height', 'fontSize', 'activeColor', 'inactiveColor', 'alignmentDirection'].forEach((name) => {
        style[name] = self.config(name)
      })

      // 自适应容器
      // if (self.config('adaptContainer')) {
      Object.assign(style, {
        width: self.containerWidth,
        height: self.containerHeight,
      })
      // }

      // 渲染组件
      self.render(
        <CheckField modal={self} options={self.options} active={self.active} onChange={self.onChange} style={style} />
      )
      // .then(self.initAnimation)
    }

    const onChange = (active, option) => {
      self.active = active
      self.event.fire('onSwitchButton', {data: option, index: active})
      self.draw({redraw: false})
    }

    // 响应事件修改input内容
    const switchButton = (value) => {
      if (typeof value === 'number') {
        self.active = value
      } else if (typeof value === 'object') {
        self.active = self.options.findIndex((option) => option.key === value.key)
      }
      self.draw({redraw: false})
    }

    // 动画初始化
    // const initAnimation = () => {
    //   if (!self.animation && self.config('enableLoopAnimation')) {
    //     self.animation = new EmptyAnimation({
    //       duration: self.config('loopAnimationDuration') || Infinity,
    //       type: 'timer',
    //       loop: true,
    //     })
    //     self.animation.event.on('end', () => self.onChange(self.nextActive, self.options[self.nextActive]))
    //     self.animation.play()
    //   }
    // }

    // 动画控制
    const playAnimation = () => {
      self.animation && self.animation.instance.play()
      !self.animation && self.log.warn('轮播动画未配置')
    }
    const pauseAnimation = () => {
      self.animation && self.animation.instance.pause()
      !self.animation && self.log.warn('轮播动画未配置')
    }
    const restartAnimation = () => {
      self.onChange(0, self.options[0])
      self.animation && self.animation.instance.restart()
      !self.animation && self.log.warn('轮播动画未配置')
    }

    return {
      data,
      draw,
      onChange,
      switchButton,
      drawFallback,
      afterCreate,
      // initAnimation,
      playAnimation,
      pauseAnimation,
      restartAnimation,
    }
  })

const CheckField = observer(({modal, active, onChange, options, style}) => {
  const {width, height, fontSize, activeColor, inactiveColor, alignmentDirection} = style
  const isHorizontal = alignmentDirection === 'HORIZONTAL'
  const textWidths = options.map((item) => modal.util.getTextWidth(item.key, fontSize))
  const totalWidth = sum(textWidths)
  const assignedWidths = textWidths.map((textWidth) => textWidth + (width - totalWidth) / textWidths.length)
  useEffect(() => {
    // 默认触发一次事件
    onChange && onChange(active, options[active])
  }, [])
  return (
    <div className={c(isHorizontal ? s.containerRow : s.containerColumn)}>
      {options.map((option, index) =>
        Children.toArray(
          <div
            className={c('hand', s.tab)}
            onClick={() => onChange(index, option)}
            style={{
              width: isHorizontal ? assignedWidths[index] : width,
              height: isHorizontal ? height : height / options.length,
              backgroundColor: active === index ? `${activeColor}` : `${inactiveColor}`,
              fontSize: `${fontSize}px`,
            }}
          >
            {option.key}
          </div>
        )
      )}
    </div>
  )
})

export default MCheck
