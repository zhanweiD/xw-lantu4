import React, {useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import Select, {components} from 'react-select'
import Icon from '@components/icon'
import Overlay from '@components/overlay'
import {Field} from '../base'
import s from './select.module.styl'

const SelectField = ({
  label,
  effective,
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

  const Option = (props) => {
    const {children} = props
    return (
      <components.Option {...props}>
        <div className={c('fbv fbjc w100p')}>
          <div className={c('omit')}>{children}</div>
        </div>
      </components.Option>
    )
  }

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

  return (
    <Field
      className={className}
      childrenClassName={childrenClassName}
      lebelClassName={labelClassName}
      label={label}
      effective={effective}
    >
      <div
        ref={selectRef}
        className={c('w100p h100p fbh fbac fbjc pr')}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Select
          // // 重构子组件
          components={{
            Option,
            Menu,
          }}
          key={`${typeof realvalue === 'undefined'}`}
          styles={customStyles()}
          options={opTransform(options)}
          onChange={(selectedOption) => {
            const v = JSON.parse(JSON.stringify(selectedOption))
            onChange(v?.value, v?.data)
          }}
          isSearchable={false}
          placeholder={placeholder}
          value={realvalue}
          defaultValue={valueTransform(options, defaultValue)}
          onMenuOpen={() => {
            const menu = window.waveview.overlayManager.get('selectMenu')
            menu.show({
              attachTo: selectRef.current,
              closable: false,
              width: selectRef.current.offsetWidth,
            })
          }}
        />

        <div className={c('pa', s.drop)}>
          <Icon name="arrow-down" fill="rgba(255, 255, 255, 0.5)" size={8} />
        </div>
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

  const currentValue = options.find((o) => o.value === selectValue)

  return (
    currentValue && {
      label: currentValue.key,
      value: currentValue.value,
    }
  )
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
        height: '24px',
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
      paddingRight: 0,
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
      display: 'block',
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

export default observer(SelectField)
