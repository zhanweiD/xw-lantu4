import React, {useRef, useEffect, useState} from 'react'
import {types} from 'mobx-state-tree'
import {observer} from 'mobx-react-lite'
import Picker from 'react-calendar'
import {MUIBase} from '../ui-base'
import Icon from '../../components/icon'
import s from './datetime-picker.module.styl'
import 'react-calendar/dist/Calendar.css'

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
        width: self.config('width'),
        height: self.config('height'),
        footSize: self.config('footSize'),
        backgroundColor: self.config('backgroundColor'),
      }

      // 自适应容器
      if (self.config('adaptContainer')) {
        Object.assign(style, {
          width:
            self.config('valueMethod') === 'timeRange'
              ? (self.containerWidth - style.fontSize) / 2
              : self.containerWidth,
          height: self.containerHeight,
        })
      }

      style.lineHeight = style.height
      // 渲染组件
      self.render(
        <DateTimePciker
          onChange={onChange}
          pickerType={self.config('pickerType')}
          valueMethod={self.config('valueMethod')}
          style={style}
          modal={self}
        />
      )
    }

    // 触发事件
    const onChange = (date) => {
      self.event.fire('onChangeTime', {
        type: self.config('pickerType'),
        data: date,
      })
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
      onChange,
      drawFallback,
      afterCreate,
    }
  })

const DateTimePciker = observer(({modal, onChange, pickerType, valueMethod, style}) => {
  let defaultValue
  const mainPickerRef = useRef(null)
  const secondPickerRef = useRef(null)
  const [isMainPickerVisible, setMainPickerVisible] = useState(false)
  const [isSecondPickerVisible, setSecondPickerVisible] = useState(false)
  const [rangeOfYear, setRangeOfYear] = useState(new Array(2).fill(new Date().getFullYear()))
  const pickerTypeMap = {
    date: 'date',
    time: 'time',
    datetime: 'datetime-local',
    year: 'text',
    month: 'month',
    week: 'week',
  }

  // 如果是范围取值，设定范围
  useEffect(() => {
    if (valueMethod === 'timeRange') {
      if (pickerType !== 'year') {
        secondPickerRef.current.min = mainPickerRef.current.value
        mainPickerRef.current.max = secondPickerRef.current.value
      } else {
        setRangeOfYear([new Date(mainPickerRef.current.value), new Date(secondPickerRef.current.value)])
      }
    }
  }, [modal.dates])
  // 设定默认值
  const parse = (number) => (number >= 10 ? `${number}` : `0${number}`)
  const now = new Date()
  switch (pickerType) {
    case 'date':
      defaultValue = `${now.getFullYear()}-${parse(now.getMonth() + 1)}-${parse(now.getDate())}`
      break
    case 'time':
      defaultValue = `${parse(now.getHours())}:${parse(now.getMinutes())}:${parse(now.getSeconds())}`
      break
    case 'datetime':
      defaultValue = `${now.getFullYear()}-${parse(now.getMonth() + 1)}-${parse(now.getDate())}T${parse(
        now.getHours()
      )}:${parse(now.getMinutes())}:${parse(now.getSeconds())}`
      break
    case 'year':
      defaultValue = `${now.getFullYear()}`
      break
    case 'month':
      defaultValue = `${now.getFullYear()}-${parse(now.getMonth() + 1)}`
      break
    case 'week':
      // eslint-disable-next-line no-case-declarations
      const basicDate = new Date()
      basicDate.setMonth(0, 1)
      defaultValue = `${now.getFullYear()}-W${Math.ceil((now - basicDate) / (24 * 60 * 60 * 1000) / 7)}`
      break
    default:
  }

  const onLocalChange = () => {
    let data

    // 给 data 赋值
    if (valueMethod === 'timePoint') {
      // 无效的值则不触发响应事件
      if (mainPickerRef.current.value === '') return
      data = [mainPickerRef.current.value]
    } else if (valueMethod === 'timeRange') {
      // 无效的值则不触发响应事件
      if (mainPickerRef.current.value === '' || secondPickerRef.current.value === '') return
      data = [mainPickerRef.current.value, secondPickerRef.current.value]
    }
    onChange({dates: data})
    modal.selectTime({dates: data})
  }

  return (
    <div className={s.inputGroup}>
      <input
        ref={mainPickerRef}
        defaultValue={modal.dates[0] || defaultValue}
        className={s.timePicker}
        type={pickerTypeMap[pickerType]}
        onChange={onLocalChange}
        onMouseDown={() => (pickerType === 'year' ? setMainPickerVisible(!isMainPickerVisible) : null)}
        style={{...style, transform: `scale(${modal.config('scale')})`}}
      />
      <Icon name="arrow-right" size={style.fontSize} className={valueMethod === 'timePoint' ? s.hide : ''} />
      <input
        ref={secondPickerRef}
        defaultValue={modal.dates[1] || defaultValue}
        className={valueMethod === 'timePoint' ? s.hide : s.timePicker}
        type={pickerTypeMap[pickerType]}
        onChange={onLocalChange}
        onMouseDown={() => (pickerType === 'year' ? setSecondPickerVisible(!isSecondPickerVisible) : null)}
        style={{...style, transform: `scale(${modal.config('scale')})`}}
      />
      <Picker
        view="decade"
        defaultValue={new Date(rangeOfYear[0])}
        maxDate={valueMethod === 'timeRange' ? new Date(rangeOfYear[1]) : null}
        className={isMainPickerVisible ? s.externalMainPicker : s.hide}
        onClickYear={(value) => (mainPickerRef.current.value = value.getFullYear()) && onLocalChange()}
      />
      <Picker
        view="decade"
        defaultValue={new Date(rangeOfYear[1])}
        minDate={valueMethod === 'timeRange' ? new Date(rangeOfYear[0]) : null}
        className={isSecondPickerVisible && valueMethod === 'timeRange' ? s.externalSecondPicker : s.hide}
        onClickYear={(value) => (secondPickerRef.current.value = value.getFullYear()) && onLocalChange()}
      />
    </div>
  )
})

export default MDatetimePicker
