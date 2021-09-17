import React, {useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import Select, {components} from 'react-select'

import Overlay from '@components/overlay'

import isDef from '@utils/is-def'
import isArray from 'lodash/isArray'

import {Field} from '../base'
import s from './column-select.module.styl'

// select 公共样式
// 下拉选项
// <SelectField label={t('选择')} options={[{value: 1, key: '阿杜'}, {value: 2, key: '撒旦'}]}/>

const ColumnSelectField = ({
  label,
  value,
  defaultValue,
  onChange = () => {},
  labelClassName,
  childrenClassName,
  className,
  options,
  placeholder = '请选择',
}) => {
  const selectRef = useRef()
  const realvalue = valueTransform(options, value)
  const extra = isArray(value)
    ? value.filter((item) => options.map((option) => option.value).indexOf(item) === -1)
    : undefined
  // 重写Option
  const Option = (props) => {
    const {children} = props

    return (
      <components.Option {...props}>
        <div className={c('fbv fbjc w100p lh24')}>
          <div className={c('omit oh', s.label)}>{children}</div>
        </div>
      </components.Option>
    )
  }

  const MultiValueLabel = (props) => {
    return (
      <div
        className="hand"
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <components.MultiValueLabel {...props} />
      </div>
    )
  }

  // 重写menu，基于overlay
  const Menu = (props) => {
    const {children} = props
    return (
      <Overlay
        model={window.waveview.overlayManager.get('selectMenu')}
        zIndex={21100}
        className={s.overlay}
        contentClassName={s.overlay_content}
      >
        <components.Menu {...props}>{children}</components.Menu>
      </Overlay>
    )
  }

  // 重写valueContainer
  const ValueContainer = ({children, ...props}) => {
    return (
      <components.ValueContainer {...props}>
        {isDef(extra) &&
          extra.map((item) => (
            <div key={item} className={c('fbh fbac mr4', s.legacy)}>
              {item}
            </div>
          ))}
        {children}
      </components.ValueContainer>
    )
  }

  return (
    <Field className={className} childrenClassName={childrenClassName} lebelClassName={labelClassName} label={label}>
      <div
        ref={selectRef}
        className={c('w100p h100p fbh fbac fbjc pr', s.filter)}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Select
          // 重构子组件
          components={{
            ...{Option, MultiValueLabel, ValueContainer},
            Menu,
          }}
          // 加这个key 是为了解决当 value 设置为 undefined 时，仍然会保留上一次的选中项
          key={`${typeof realvalue === 'undefined'}`}
          styles={customStyles()}
          options={opTransform(options)}
          onChange={(selectedOption) => {
            const v = JSON.parse(JSON.stringify(selectedOption))

            onChange(
              v?.map((o) => o.value),
              v?.map((o) => o.data)
            )
          }}
          placeholder={placeholder}
          // value={valueTransform(options, value, isMulti)}
          value={realvalue}
          defaultValue={valueTransform(options, defaultValue)}
          isClearable={false}
          isMulti
          isSearchable={false}
          onMenuOpen={() => {
            const menu = window.waveview.overlayManager.get('selectMenu')
            menu.show({
              attachTo: selectRef.current,
              closable: false,
              width: selectRef.current.offsetWidth,
            })
          }}
          onMenuClose={() => {}}
        />
      </div>
    </Field>
  )
}

// 选项转换函数
export const opTransform = (options = []) => {
  return options.map((item) => ({
    label: item.key,
    value: item.value,
  }))
}
// 选中值转换函数
export const valueTransform = (options = [], selectValue) => {
  if (typeof selectValue === 'undefined') {
    return undefined
  }

  // options中取出选择过滤的选项数组
  const selectFilter = options
    .filter((o) => selectValue.indexOf(o.value) > -1)
    .map((o) => ({
      label: o.key,
      value: o.value,
    }))
  // 按照selectValue数组的顺序排序
  return selectFilter.sort((prev, next) => selectValue.indexOf(prev.value) - selectValue.indexOf(next.value))
}

const customStyles = () => {
  return {
    option: (provided, state) => {
      return {
        ...provided,
        cursor: state.isSelected ? 'not-allowed' : 'auto',
        ':hover': {
          backgroundColor: state.isSelected ? '#07f' : 'rgba(255, 255, 255, 0.1)',
        },
        borderBottom: state.data.label !== state.options.slice(-1)[0].label ? '1px solid #1B1B1B' : 'none',

        padding: 8,
        height: '24px',
        backgroundColor: state.isSelected ? '#07f' : 'transparent',
        display: 'flex',
        alignItems: 'center',
      }
    },

    container: (provided) => ({
      ...provided,
      width: '100%',
      minWidth: '50px',
      minHeight: '24px',
      lineHeight: 'normal',
      position: 'relative',
    }),

    control: (provided, state) => {
      return {
        ...provided,
        minHeight: '24px',
        height: 'auto',
        lineHeight: 'normal',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        ':hover': {
          borderBottomColor: '#07f',
        },
        borderBottom: state.isFocused ? '1px solid #07f' : '1px solid rgba(255, 255, 255, 0.1)',
      }
    },

    valueContainer: (provided) => ({
      ...provided,
      minHeight: '24px',
      padding: 0,
      paddingRight: '24px',
    }),

    input: (provided) => ({
      ...provided,
      outline: 'none',
      margin: 0,
      padding: 0,
      color: '#FFFFFF',
    }),

    menu: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(55,55, 55, 0.8)',
      backdropFilter: 'saturate(180%) blur(20px)',
      zIndex: 21100,
      marginTop: 0,
      marginBottom: 0,
      borderRadius: 0,
      position: 'relative',
      top: 0,
    }),

    menuList: (provided) => ({
      ...provided,
      maxHeight: `200px`,
      '::-webkit-scrollbar-thumb': {
        backgroundColor: '#07f',
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: 'transparent',
      },
      backgroundColor: 'transparent',
      padding: 0,
    }),

    indicatorSeparator: () => ({
      display: 'none',
    }),

    dropdownIndicator: () => ({
      display: 'none',
    }),

    clearIndicator: (provided) => ({
      ...provided,
      display: 'none',
    }),

    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'rgb(0, 126, 255)',
      height: '19px',
      borderRadius: '8px',
      alignItems: 'center',
      marginRight: '4px',
      marginLeft: '0px',
      maxWidth: '150px',
    }),

    multiValueRemove: (provided) => ({
      ...provided,
      display: 'flex',
      height: '19px',
      paddingLeft: '2.5px',
      paddingRight: '2.5px',
    }),

    multiValueLabel: (provided) => ({
      ...provided,
      color: '#FFFFFF',
      opacity: 1,
      paddingLeft: '6px',
      paddingRight: '3px',
    }),

    placeholder: (provided) => ({
      ...provided,
      margin: 0,
      padding: 4,
      display: 'none',
    }),

    singleValue: (provided) => {
      return {
        ...provided,
        color: '#FFFFFF',
        opacity: 1,
        margin: 0,
        width: '100%',
        height: '100%',
        padding: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: '16px',
      }
    },
  }
}

export default observer(ColumnSelectField)
