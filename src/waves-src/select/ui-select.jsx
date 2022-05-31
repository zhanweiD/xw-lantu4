import React, {Children, useState, useEffect} from 'react'
import {types} from 'mobx-state-tree'
import {observer} from 'mobx-react-lite'
import {MUIBase} from '../ui-base'
import s from './ui-select.module.styl'

const MSelect = MUIBase.named('MSelect')
  .props({
    selectKeys: types.array(types.string),
    selectData: types.array(types.frozen()),
    selectActiveKeys: types.array(types.string),
    values: types.array(types.maybe(types.string)),
    text: types.array(types.maybe(types.string)),
    selectBorders: types.array(types.frozen()),
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
        'optionHoverTextColor',
        'optionHoverBackgroundColor',
        'placeholder',
        'placeholderFontSize',
        'placeholderColor',
        'supportSearch',
        'allowClear',
        'radius',
      ]?.forEach((name) => (style[name] = self.config(name)))

      // 自适应容器
      // if (self.config('adaptContainer')) {
      Object.assign(style, {
        width: self.containerWidth,
        height: self.containerHeight,
        optionWidth: self.containerWidth,
        optionHeight: self.containerHeight,
      })
      // }

      self.render(
        <div
          className={s.container}
          style={{
            backgroundColor: style.backgroundColor,
            borderRadius: style.radius,
          }}
        >
          {self.selectKeys.map((key, index) => {
            return Children.toArray(
              <ConfiguredSelect
                modal={self}
                style={style}
                options={self.selectData.map((item) => item)}
                value={self.selectData[0]?.key}
                onClear={() => self.onChange('', index)}
                isActive={self.selectActiveKeys.findIndex((active) => active === self.selectKeys[index]) > -1}
              />
            )
          })}
        </div>
      )
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
      // onChange,
      switchOption,
      drawFallback,
      afterCreate,
    }
  })

const ConfiguredSelect = observer(({style, options, isActive}) => {
  const [inputValue, setInputValue] = useState('')
  const [isOptionVisible, setOptionVisible] = useState(false)
  const [isFalseIconVisible, setIsFalseIconVisible] = useState(false)
  const [optionData, setOptionData] = useState([])
  const [hoverIndex, setHoverIndex] = useState(-1)
  const [selectBorders, setSelectBorders] = useState(false)

  useEffect(() => {
    setOptionData(options)
  }, [options])

  const onChange = (obj) => {
    setInputValue(obj.key)
  }

  const handleChange = (e) => {
    setInputValue(e.target.value)
    const newArr = options.filter((v, i) => v.key?.includes(e.target.value) && [options[i]])
    setOptionData(newArr)
  }

  const selectStyle = {
    width: style.width,
    height: style.height,
    borderRadius: style.radius,
    padding: '0 10px',
  }
  !isActive && (selectStyle.pointerEvents = 'none')

  // 整个输入框
  const inputContainerStyle = {
    flex: 1,
    fontSize: style.width / 16,
    color: style.fontColor,
    height: style.height,
    cursor: style.enableSearch ? 'text' : 'pointer',
    backgroundColor: style.backgroundColor, // 不加的话会受全局样式影响
    border: 'none', // 不加的话会受全局样式影响
    caretColor: style.supportSearch ? 'rgb(255,255,255)' : 'rgb(0,0,0)',
  }
  // 整个下拉框
  const optionContainerStyle = {
    position: 'absolute',
    display: isOptionVisible ? 'block' : 'none',
    transform: `translate(-10px, ${
      style.unfoldingDirection === 'down'
        ? 0
        : -style.height - Math.min(style.optionHeight * options.length, style.totalHeight)
    }px)`,
    top: style.height,
    width: '100%',
    height: optionData.length === 5 || optionData.length > 5 ? style.height * 5 : null,
    overflow: 'scroll',
    border: `${style.optionBorderWidth}px solid ${style.optionBorderColor}`,
    margin: '5px 0 0 -10px',
    textAlign: 'left',
  }

  // 下拉项默认时
  const optionStyle = {
    width: `${style.optionWidth - 20}px`,
    height: `${style.optionHeight}px`,
    lineHeight: `${style.optionHeight}px`,
    fontSize: style.width / 16,
    color: style.optionFontColor,
    backgroundColor: style.optionBackgroundColor,
    cursor: 'pointer',
  }

  // 下拉项悬浮时
  const hoverOptionStyle = {
    ...optionStyle,
    backgroundColor: style.optionHoverBackgroundColor,
    color: style.optionHoverTextColor,
  }
  return (
    <div
      style={{...selectStyle, border: `2px solid ${selectBorders ? 'rgb(83,158,248)' : '#999'}`}}
      className={s.selectContainer}
      onClick={() => setOptionVisible(true)}
      onFocus={() => setSelectBorders(true)}
      onBlur={() => {
        setOptionVisible(false)
        setSelectBorders(false)
      }}
      onMouseOver={() => setIsFalseIconVisible(true)}
      onMouseLeave={() => setIsFalseIconVisible(false)}
    >
      <input
        value={inputValue}
        placeholder={style.placeholder}
        style={inputContainerStyle}
        onChange={(e) => handleChange(e)}
      />
      {/* 叉号icon */}
      {!style.supportSearch && (
        <span
          className={s.falseIcon}
          style={{display: isFalseIconVisible ? 'block' : 'none'}}
          onClick={() => {
            setInputValue('')
            setOptionVisible(false)
            setIsFalseIconVisible(false)
          }}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="close"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
          </svg>
        </span>
      )}

      {/* 搜索icon */}
      {style.supportSearch && (
        <svg
          style={{
            verticalAlign: 'middle',
            fill: 'currentColor',
            overflow: 'hidden',
            display: isOptionVisible ? 'block' : 'none',
          }}
          width={style.width / 14}
          height={style.width / 14}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2139"
        >
          <path
            d="M953.474215 908.234504l-152.576516-163.241391c61.92508-74.48211 95.81186-167.36973 95.81186-265.073744 0-229.294809-186.63531-415.930119-416.102133-415.930119-229.294809 0-415.930119 186.63531-415.930119 415.930119s186.63531 415.930119 415.930119 415.930119c60.032925 0 118.00168-12.55703 172.186125-37.327062 16.169326-7.396607 23.221905-26.318159 15.825298-42.315471-7.396607-16.169326-26.318159-23.221905-42.315471-15.825298-45.927768 20.813707-94.951789 31.478582-145.695952 31.478582-194.031917 0-351.94087-157.908953-351.94087-351.94087 0-194.031917 157.908953-351.94087 351.94087-351.94087 194.031917 0 351.94087 157.908953 351.94087 351.94087 0 91.339493-34.918864 177.86259-98.048043 243.743995-12.213002 12.729044-11.868974 33.026709 0.860071 45.239711 1.032085 0.860071 2.236183 1.204099 3.268268 2.064169 0.860071 1.204099 1.376113 2.752226 2.408198 3.956325l165.477574 177.00252c6.192508 6.70855 14.793214 10.148833 23.393919 10.148833 7.912649 0 15.653284-2.92424 21.845792-8.600706C964.827146 941.433227 965.515202 921.135562 953.474215 908.234504z"
            p-id="2140"
          ></path>
        </svg>
      )}

      {/* 下拉icon */}

      {style.supportSearch && (
        <span
          onClick={() => setOptionVisible(true)}
          readOnly={!style.enableSearch}
          style={{display: isOptionVisible ? 'none' : 'block'}}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="down"
            width={style.width / 14}
            height={style.width / 14}
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
          </svg>
        </span>
      )}

      {/* 下拉选项 */}
      <div style={{...optionContainerStyle}} className={s.optionContainer}>
        {console.log(optionData)}
        {optionData.length > 0 ? (
          optionData.map(({key, value}, i) =>
            Children.toArray(
              <a title={key}>
                {console.log(key, value)}
                <div
                  className={s.optionTextStyle}
                  style={hoverIndex === i ? hoverOptionStyle : optionStyle}
                  onMouseDown={() => {
                    onChange({key, value})
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
          )
        ) : (
          <div className={s.noData} style={{fontSize: style.width / 22, color: '#999', textAlign: 'center'}}>
            {console.log('style.width / 15', style.width / 15)}
            <svg
              width={style.width / 3}
              height={style.width / 3}
              style={{verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden', margin: 'auto'}}
              t="1653918868412"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1597"
            >
              <path
                d="M102.4 896a409.6 51.2 0 1 0 819.2 0 409.6 51.2 0 1 0-819.2 0Z"
                fill="#bfbfbf"
                opacity=".1"
                p-id="1598"
              ></path>
              <path
                d="M116.736 376.832c0 8.704 6.656 15.36 15.36 15.36s15.36-6.656 15.36-15.36-6.656-15.36-15.36-15.36c-8.192 0-15.36 7.168-15.36 15.36zM926.72 832c-19.456 5.12-23.552 9.216-28.16 28.16-5.12-19.456-9.216-23.552-28.16-28.16 18.944-5.12 23.552-9.216 28.16-28.16 4.608 18.944 8.704 23.552 28.16 28.16zM202.24 323.072c-25.088 6.656-30.208 11.776-36.864 36.864-6.656-25.088-11.776-30.208-36.864-36.864 25.088-6.656 30.208-12.288 36.864-36.864 6.144 25.088 11.776 30.208 36.864 36.864zM816.64 235.008c-15.36 4.096-18.432 7.168-22.528 22.528-4.096-15.36-7.168-18.432-22.528-22.528 15.36-4.096 18.432-7.168 22.528-22.528 3.584 15.36 7.168 18.432 22.528 22.528zM882.688 156.16c-39.936 10.24-48.128 18.944-58.88 58.88-10.24-39.936-18.944-48.128-58.88-58.88 39.936-10.24 48.128-18.944 58.88-58.88 10.24 39.424 18.944 48.128 58.88 58.88z"
                fill="#bfbfbf"
                opacity=".5"
                p-id="1599"
              ></path>
              <path
                d="M419.84 713.216v4.096l33.792 31.232 129.536-62.976L465.92 760.832v36.864l18.944-18.432v-0.512 0.512l18.944 18.432 100.352-122.88v-4.096z"
                fill="#bfbfbf"
                opacity=".2"
                p-id="1600"
              ></path>
              <path
                d="M860.16 551.936v-1.024c0-1.024-0.512-1.536-0.512-2.56v-0.512l-110.08-287.232c-15.872-48.64-60.928-81.408-112.128-81.408H387.072c-51.2 0-96.256 32.768-112.128 81.408L164.864 547.84v0.512c-0.512 1.024-0.512 1.536-0.512 2.56V757.76c0 65.024 52.736 117.76 117.76 117.76h460.8c65.024 0 117.76-52.736 117.76-117.76v-204.8c-0.512-0.512-0.512-0.512-0.512-1.024zM303.616 271.36s0-0.512 0.512-0.512C315.392 233.984 349.184 209.92 387.072 209.92h249.856c37.888 0 71.68 24.064 83.456 60.416 0 0 0 0.512 0.512 0.512l101.888 266.24H588.8c-8.704 0-15.36 6.656-15.36 15.36 0 33.792-27.648 61.44-61.44 61.44s-61.44-27.648-61.44-61.44c0-8.704-6.656-15.36-15.36-15.36H201.728L303.616 271.36zM829.44 757.76c0 48.128-38.912 87.04-87.04 87.04H281.6c-48.128 0-87.04-38.912-87.04-87.04v-189.44h226.816c7.168 43.52 45.056 76.8 90.624 76.8s83.456-33.28 90.624-76.8H829.44v189.44z"
                fill="#bfbfbf"
                opacity=".5"
                p-id="1601"
              ></path>
              <path
                d="M512 578.56c-14.336 0-25.6-11.264-25.6-25.6V501.76H253.44l83.968-219.136 0.512-1.024c7.168-21.504 26.624-35.84 49.152-35.84h249.856c22.528 0 41.984 14.336 49.152 35.84l0.512 1.024L770.56 501.76H537.6v51.2c0 14.336-11.264 25.6-25.6 25.6z"
                fill="#bfbfbf"
                opacity=".2"
                p-id="1602"
              ></path>
            </svg>
            暂无数据
          </div>
        )}
      </div>
    </div>
  )
})

export default MSelect
