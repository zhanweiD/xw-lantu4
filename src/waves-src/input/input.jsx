import React, {useEffect, useState} from 'react'
import {types} from 'mobx-state-tree'
import {MUIBase} from '../ui-base'
import {observer} from 'mobx-react-lite'
import s from './input.module.styl'
import c from 'classnames'

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
        fontSize:
          self.config('width') / self.config('height') > 9
            ? `${self.config('width') / 25}px`
            : `${self.config('width') / 20}px`,
        backgroundColor: self.config('backgroundColor'),
        borderRadius: self.config('radius'),
        borderColor: self.config('borderColor'),
        borderWidth: self.config('borderWidth'),
        padding: '5px 10px 5px 20px',
        radius: self.config('radius'),
        maxLength: self.config('maxLength'),
        isDisabled: self.config('isDisabled'),
        isDisplayTextNum: self.config('isDisplayTextNum'),
        content: self.config('content'),
        focusColor: self.config('focusColor'),
        shadowColor: self.config('shadowColor'),
        shadowWidth: self.config('shadowWidth'),
        shadowFuzziness: self.config('shadowFuzziness'),
      }

      // 自适应容器
      if (self.config('adaptContainer')) {
        Object.assign(style, {
          width: self.containerWidth,
          height: self.containerHeight,
        })
      }

      // 渲染组件
      self.render(<ConfiguredInput self={self} style={style} />)
    }

    // 改变 input 内容
    const onChange = (e) => {
      self.event.fire('change', {data: e.target.value})
      self.text = e.target.value
    }

    return {
      draw,
      onChange,
      drawFallback,
      afterCreate,
    }
  })

const ConfiguredInput = observer(({self, style}) => {
  const [isVisible, setIconVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [curlength, setCurLength] = useState(0)
  const [selectBorders, setSelectBorders] = useState(false)

  useEffect(() => {
    setInputValue(self.text)
  }, [self.text])

  useEffect(() => {
    setInputValue(style.content)
    setCurLength(style.content.length)
  }, [style.content])

  // 改变 input 内容
  const onChange = (e) => {
    setCurLength(e.target.value?.length)
    setInputValue(e.target.value)
  }

  return (
    <div
      className={c('w100p', s.container)}
      style={{
        ...style,
        borderRadius: style.radius,
        border: `${style.borderWidth}px solid ${selectBorders ? style.focusColor : style.borderColor}`,
        backgroundColor: style.isDisabled ? 'rgb(181,181,181)' : style.backgroundColor,
        boxSizing: 'border-box',
        cursor: style.isDisabled && 'not-allowed',
        boxShadow: `${style.shadowColor} 0px 0px ${style.shadowFuzziness}px ${style.shadowWidth}px`,
      }}
      onMouseOver={() => setIconVisible(true)}
      onMouseLeave={() => setIconVisible(false)}
      onFocus={() => setSelectBorders(true)}
      onBlur={() => {
        setSelectBorders(false)
      }}
    >
      <input
        value={inputValue}
        onChange={onChange}
        placeholder={self.config('placeholder')}
        style={{
          border: 'none',
          color: style.color,
          backgroundColor: style.isDisabled ? 'rgb(181,181,181)' : style.backgroundColor,
          fontSize: style.fontSize,
          width: style.isDisplayTextNum ? style.width * 0.75 : style.width * 0.85,
          pointerEvents: style.isDisabled && 'none',
        }}
        maxLength={style.maxLength}
      />
      {/* 字数提示 */}
      {style.isDisplayTextNum && (
        <span style={{color: 'rgb(117,117,117)', position: 'absolute', right: '20px'}}>
          {curlength}/{style.maxLength}
        </span>
      )}

      {/* 删除icon */}
      {!style.isDisabled && (
        <span
          className={s.falseIcon}
          style={{
            display: isVisible ? 'block' : 'none',
            position: 'absolute',
            right: 15,
          }}
          onClick={() => {
            setInputValue('')
            setCurLength(0)
          }}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="close"
            width="0.5em"
            height="0.5em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
          </svg>
        </span>
      )}
    </div>
  )
})

export default MInput
