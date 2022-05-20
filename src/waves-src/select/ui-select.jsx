import React, {Children, useState, useEffect} from 'react'
import {types} from 'mobx-state-tree'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {MUIBase} from '../ui-base'
import Icon from '../../components/icon'
import s from './ui-select.module.styl'

const MSelect = MUIBase.named('MSelect')
  .props({
    selectKeys: types.array(types.string),
    selectData: types.array(types.frozen()),
    selectActiveKeys: types.array(types.string),
    values: types.array(types.maybe(types.string)),
  })
  .views((self) => ({
    get filterOptions() {
      // 连接处
      let filteredData = self.selectData.map((item) => item)
      return filteredData
    },
  }))
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'select'
    }

    // 传入数据
    const data = (selectData) => {
      self.selectKeys = selectData.keys
      self.selectData = selectData.data
      self.selectActiveKeys = selectData.activeKeys
      self.values = self.selectKeys.map((key) => (selectData.defaultOptions ? selectData.defaultOptions[key] : ''))
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.selectKeys = ['default']
      self.selectActiveKeys = ['default']
      self.selectData = [{label: '省份', value: 'shengfen'}]
      self.values = []
      self.draw({redraw: false})
    }

    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }

      const style = {}
      ;[
        'enableSearch',
        'width',
        'height',
        'totalHeight',
        'fontSize',
        'fontColor',
        'backgroundColor',
        'unfoldingDirection',
        'inputBorderWidth',
        'inputBorderColor',
        'optionWidth',
        'optionHeight',
        'optionFontSize',
        'optionFontColor',
        'optionBackgroundColor',
        'optionFocusBackgroundColor',
        'optionBorderWidth',
        'optionBorderColor',
        'optionHoverBackgroundColor',
        'placeholderFontSize',
        'placeholderColor',
      ]?.forEach((name) => (style[name] = self.config(name)))

      // 自适应容器
      // if (self.config('adaptContainer')) {
      Object.assign(style, {
        width: self.containerWidth / self.selectKeys.length,
        height: self.containerHeight,
        optionWidth: self.containerWidth / self.selectKeys.length,
        optionHeight: self.containerHeight,
      })
      // }

      self.render(
        <div
          className={s.container}
          style={{
            backgroundColor: style.backgroundColor,
            border: `${style.inputBorderWidth}px solid ${style.inputBorderColor}`,
          }}
        >
          {self.selectKeys.map((key, index) => {
            return Children.toArray(
              <ConfiguredSelect
                modal={self}
                style={style}
                options={self.selectData}
                value={self.values[index]}
                onChange={onChange}
                onClear={() => self.onChange('', index)}
                isActive={self.selectActiveKeys.findIndex((active) => active === self.selectKeys[index]) > -1}
              />
            )
          })}
        </div>
      )
    }

    const onChange = (key, value) => {
      console.log('接收change', key, value)
      self.values[value] = key

      // 数据更新，进行重新绘制
      setTimeout(() => self.draw({redraw: false}), 0)
    }

    // 响应事件
    const switchOption = (ruleValue) => {
      if (Array.isArray(ruleValue.data) && ruleValue.data.length <= self.selectKeys.length) {
        self.values = ruleValue.data
        setTimeout(() => self.draw({redraw: false}), 0)
      } else {
        console.error('数据格式不正确', ruleValue)
      }
    }

    return {
      data,
      draw,
      onChange,
      switchOption,
      drawFallback,
      afterCreate,
    }
  })

const ConfiguredSelect = observer(({style, options, value, onChange, onClear, isActive}) => {
  const [inputValue, setInputValue] = useState(value)
  const [isOptionVisible, setOptionVisible] = useState(false)
  const [isClearIconVisiable, setClearIconVisiable] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(-1)
  const onMouseEnter = () => setClearIconVisiable(true)
  const onMouseLeave = () => setClearIconVisiable(false)

  useEffect(() => setInputValue(value), [value])
  const selectStyle = {
    width: style.width,
    height: style.height,
    padding: '0 10px',
  }
  !isActive && (selectStyle.pointerEvents = 'none')
  const inputContainerStyle = {
    flex: 1,
    fontSize: style.fontSize,
    color: style.fontColor,
    height: style.height,
    cursor: style.enableSearch ? 'text' : 'pointer',
    backgroundColor: style.backgroundColor, // 不加的话会受全局样式影响
    border: 'none', // 不加的话会受全局样式影响
  }
  const placeholderStyle = {
    ...inputContainerStyle,
    fontSize: style.placeholderFontSize,
    color: style.placeholderColor,
  }
  const optionContainerStyle = {
    position: 'absolute',
    display: isOptionVisible ? 'block' : 'none',
    transform: `translate(-10px, ${
      style.unfoldingDirection === 'down'
        ? 0
        : -style.height - Math.min(style.optionHeight * options.length, style.totalHeight)
    }px)`,
    top: style.height,
    maxHeight: style.totalHeight,
    overflow: 'scroll',
    border: `${style.optionBorderWidth}px solid ${style.optionBorderColor}`,
    width: '100%',
    marginLeft: '-10px',
  }
  const optionStyle = {
    alignItems: 'center',
    width: `${style.optionWidth + 20}px`,
    height: `${style.optionHeight}px`,
    lineHeight: `${style.optionHeight}px`,
    fontSize: style.fontSize / 2 + 5,
    color: style.optionFontColor,
    backgroundColor: style.optionBackgroundColor,
    cursor: 'pointer',
  }
  const hoverOptionStyle = {
    ...optionStyle,
    backgroundColor: style.optionHoverBackgroundColor,
  }
  return (
    <div style={selectStyle} {...{onMouseEnter, onMouseLeave}} className={s.selectContainer}>
      <input
        type="text"
        value={inputValue || (isOptionVisible ? '' : '请输入')}
        style={inputValue ? inputContainerStyle : placeholderStyle}
        className={s.textCenter}
        onFocus={() => setOptionVisible(true)}
        onBlur={() => setOptionVisible(false)}
        readOnly={!style.enableSearch}
      />
      <span
        className={s.textCenter}
        onFocus={() => setOptionVisible(true)}
        onBlur={() => setOptionVisible(false)}
        readOnly={!style.enableSearch}
      >
        <svg
          viewBox="64 64 896 896"
          focusable="false"
          data-icon="down"
          width={style.fontSize - 5}
          height={style.fontSize - 5}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
        </svg>
      </span>
      <div style={optionContainerStyle} className={s.optionContainer}>
        {options.map(({key, value}, i) =>
          Children.toArray(
            <a title={key}>
              <div
                className={c('omit', s.option)}
                style={hoverIndex === i ? hoverOptionStyle : optionStyle}
                onMouseDown={() => {
                  onChange(key, value)
                  setInputValue(key)
                  setOptionVisible(false)
                }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseOut={() => setHoverIndex(-1)}
              >
                {key}
              </div>
            </a>
          )
        )}
      </div>
      <div
        style={{visibility: isClearIconVisiable && style.enableSearch ? 'visible' : 'hidden'}}
        onClick={() => {
          onClear()
          setInputValue('')
        }}
      >
        <Icon name="close" size={style.fontSize} fill={style.fontColor} />
      </div>
    </div>
  )
})

export default MSelect
