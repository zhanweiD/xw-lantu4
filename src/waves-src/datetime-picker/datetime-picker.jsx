import React, {useEffect, useRef, useState} from 'react'
import {types} from 'mobx-state-tree'
import {observer} from 'mobx-react-lite'
import Calendar from 'react-calendar'
import {MUIBase} from '../ui-base'
import 'react-calendar/dist/Calendar.css'
import moment from 'moment'
import s from './datetime-picker.module.styl'

const MDatetimePicker = MUIBase.named('MDatetimePicker')
  .props({
    dates: types.array(types.string),
    text: types.maybe(types.string),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'uiDatetiemPicker'
    }

    // 无数据或数据错误时，采用备用数据渲染
    const drawFallback = () => {
      self.draw({redraw: false})
    }

    const data = (dates) => {
      self.dates = dates
    }

    // 和图表的方法保持一致
    const draw = ({redraw}) => {
      if (redraw === true) {
        self.removeNode(self.container?.parentNode)
      }
      const style = {
        width:
          self.config('valueMethod') === 'timeRange'
            ? (self.containerWidth - 0.2 * self.containerWidth) / 2
            : self.containerWidth - 0.2 * self.containerWidth,
        height: self.containerHeight,
        inputHeight: self.containerHeight * 0.1,
        borderColor: self.config('borderColor'),
        fontSize: self.containerWidth / 30,
        connectLineType: self.config('connectLineType'),
        isDisabled: self.config('isDisabled'),
      }

      // 渲染组件
      self.render(
        <DateTimePciker
          self={self}
          pickerType={self.config('pickerType')}
          valueMethod={self.config('valueMethod')}
          style={style}
          modal={self}
        />
      )
    }

    // 响应事件，也是修改数据的事件
    const selectTime = (data) => {
      // date 数组长度为 1 就是时间点，长度为 2 就是时间范围
      if (data.dates.length === 1) {
        self.dates = [data.dates[0], data.dates[0]]
      } else if (data.dates.length === 2) {
        self.dates = [data.dates[0], data.dates[1]]
      }
      // 重新绘制
      self.draw({redraw: true})
    }

    return {
      data,
      draw,
      selectTime,
      drawFallback,
      afterCreate,
    }
  })

const DateTimePciker = observer(({self, modal, pickerType, valueMethod, style}) => {
  const mainPickerRef = useRef(null)
  const secondPickerRef = useRef(null)
  const [isVisible, setIconVisible] = useState(false)
  const [flag, setFlag] = useState(false)
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [isMainPickerVisible, setMainPickerVisible] = useState(false)
  const [dateValue, setDateValue] = useState([
    `${moment(new Date()).format('YYYY-MM-DD')}`,
    `${new Date().getFullYear()}-${new Date().getMonth() + 2}-${new Date().getDate()}`,
  ])
  const [currentCalendarType, setCurrentCalendarType] = useState('')
  const {width, height, inputHeight, fontSize, connectLineType, isDisabled} = style

  useEffect(() => {
    setCalendarVisible(false)
  }, [dateValue])

  // 监听：日期类型
  useEffect(() => {
    switch (pickerType) {
      case 'month':
        setCurrentCalendarType('month')
        break
      case 'year':
        setCurrentCalendarType('year')
        break
      case 'decade':
        setCurrentCalendarType('decade')
        break
      case 'century':
        setCurrentCalendarType('century')
        break
      default:
        'month'
        setCurrentCalendarType('month')
    }
  }, [pickerType])

  const onChange = (date) => {
    const parse = (number) => (number >= 10 ? `${number}` : `0${number}`)
    let dateStart = ''
    let dateEnd = ''
    if (valueMethod === 'timePoint') {
      dateStart = `${date.getFullYear()}-${parse(date.getMonth() + 1)}-${parse(date.getDate())}`
    } else if (valueMethod === 'timeRange') {
      dateStart = `${date[0].getFullYear()}-${parse(date[0].getMonth() + 1)}-${parse(date[0].getDate())}`
      dateEnd = `${date[1].getFullYear()}-${parse(date[1].getMonth() + 1)}-${parse(date[1].getDate())}`
    } else {
      return
    }
    setDateValue([dateStart, dateEnd])

    self.event.fire('onChangeTime', {
      type: self.config('pickerType'),
      data: date,
    })
  }

  const handleClick = () => {
    setFlag(true)
    setDateValue(['', ''])
    self.event.fire('onChangeTime', {
      type: self.config('pickerType'),
      data: undefined,
    })
  }

  return (
    <div tabIndex="0" onClick={() => (!isDisabled || flag) && setCalendarVisible(true)}>
      <div
        className={s.inputGroup}
        style={{height: inputHeight, backgroundColor: isDisabled ? '#999' : '', cursor: isDisabled && 'not-allowed'}}
        onMouseOver={() => setIconVisible(true)}
        onMouseLeave={() => setIconVisible(false)}
      >
        {/* 起始-结束时间 */}
        <input
          ref={mainPickerRef}
          value={dateValue[0]}
          className={s.timePicker}
          onMouseDown={() => (pickerType === 'year' ? setMainPickerVisible(!isMainPickerVisible) : null)}
          style={{
            width,
            fontSize,
            transform: `scale(${modal.config('scale')})`,
            flex: 5,
            backgroundColor: isDisabled ? '#999' : 'rgb(27,27,27)',
            cursor: isDisabled && 'not-allowed',
          }}
          readOnly
        />
        <span style={{fontSize: fontSize}} className={valueMethod === 'timePoint' ? s.hide : s.iconShow}>
          {connectLineType === 'wavyline' ? (
            '～'
          ) : connectLineType === 'shortline' ? (
            '—'
          ) : connectLineType === 'arrow' ? (
            <svg
              viewBox="0 0 1024 1024"
              focusable="false"
              data-icon="swap-right"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M873.1 596.2l-164-208A32 32 0 00684 376h-64.8c-6.7 0-10.4 7.7-6.3 13l144.3 183H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h695.9c26.8 0 41.7-30.8 25.2-51.8z"></path>
            </svg>
          ) : null}
        </span>

        {/* 结束时间 */}
        <input
          ref={secondPickerRef}
          value={dateValue[1]}
          className={valueMethod === 'timePoint' ? s.hide : s.timePicker}
          style={{
            width,
            fontSize,
            transform: `scale(${modal.config('scale')})`,
            flex: 5,
            backgroundColor: isDisabled ? '#999' : 'rgb(27,27,27)',
            cursor: isDisabled && 'not-allowed',
          }}
          readOnly
          disabled={isDisabled}
        />

        {/* 日历icon */}
        <svg
          style={{
            width: valueMethod === 'timePoint' ? `${width / 14}px` : `${width / 8}px`,
            height: valueMethod === 'timePoint' ? `${width / 14}px` : `${width / 8}px`,
            position: 'absolute',
            right: '20px',
            fill: 'currentColor',
            display: !isVisible ? 'block' : 'none',
          }}
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1517"
        >
          <path
            d="M896 448H128v447.957333l477.738667 0.021334L896 895.957333V448z m0-42.666667V192.042667C896 192 768 192 768 192V149.333333h128.042667A42.666667 42.666667 0 0 1 938.666667 192.042667v703.914666A42.624 42.624 0 0 1 896.064 938.666667H127.936A42.666667 42.666667 0 0 1 85.333333 895.957333V192.042667C85.333333 168.469333 104.256 149.333333 127.957333 149.333333H256v42.666667l-128 0.042667V405.333333h768zM298.666667 85.333333h42.666666v170.666667h-42.666666V85.333333z m384 0h42.666666v170.666667h-42.666666V85.333333zM384 149.333333h256v42.666667H384V149.333333z"
            fill="#999"
            p-id="1518"
          ></path>
        </svg>

        {/* 删除icon */}
        <span
          className={s.falseIcon}
          style={{
            display: !isDisabled && isVisible ? 'block' : 'none',
            position: 'absolute',
            right: '20px',
          }}
          onClick={handleClick}
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
      </div>

      {/* 起始-结束日历 */}
      {calendarVisible && (
        <div style={{width: self.containerWidth, height: `${height - inputHeight}px`}}>
          <Calendar selectRange={valueMethod === 'timeRange'} onChange={onChange} maxDetail={currentCalendarType} />
        </div>
      )}
    </div>
  )
})

export default MDatetimePicker
