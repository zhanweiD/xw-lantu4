import React, {useRef} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import Select, {components} from 'react-select'
import Icon from '@components/icon'
// import isDef from '@utils/is-def'
import Overlay from '@components/overlay'
import isEqual from 'lodash/isEqual'
import isDef from '@utils/is-def'
import isArray from 'lodash/isArray'
// import IconButton from '@components/icon-button'
import {Field} from './base'
import s from './select.module.styl'

// select 公共样式
// 下拉选项
// <SelectField label={t('选择')} options={[{value: 1, key: '阿杜'}, {value: 2, key: '撒旦'}]}/>

export const SelectField = observer(
  ({
    label,
    tip,
    value,
    defaultValue,
    onChange = () => {},
    className,
    options,
    readOnly = false,
    readOnlyHighLight = false,
    // select类型
    type = 'basic-select',
    hasRemark = false,
    allowClear = false,
    isMulti = false,
    placeholder = '请选择',
    // 菜单显示位置
    // menuPlacement = 'auto',
    // 显示菜单最大底部空间
    // menuMaxBottomPadding = 200,
    // 菜单最大高度
    maxMenuHeight,
    // menu计算显示位置基于的容器, 参数：元素 || CSS选择器， 默认是基于viewport
    // container,
    // 菜单fixed定位
    // isFixed = false,
    // 滚动文档关闭菜单, fixed定位默认关闭
    isCloseMenuOnScroll = false,
    resetChildrenComponents = {},
    onAction = () => {},
  }) => {
    // const [computeMenuPlacement, setComputeMenuPlacement] = useState(null)
    const selectRef = useRef()

    // useEffect(() => {
    //   // 计算容器底部是否有空余空间
    //   const parentContainer = typeof container === 'string' ? document.querySelector(container) : container
    //   if (isDef(parentContainer) && menuPlacement === 'auto') {
    //     if (parentContainer.getBoundingClientRect().bottom - selectRef.current.getBoundingClientRect().bottom < menuMaxBottomPadding) {
    //       setComputeMenuPlacement('top')
    //     } else {
    //       setComputeMenuPlacement('bottom')
    //     }
    //   }
    // }, [])

    // useEffect(() => {
    //   if (isFixed) {
    //     // fixed定位下设置z-index 21000
    //     const containerNodeList = selectRef.current.firstChild.children
    //     if (containerNodeList.length > 2) {
    //       containerNodeList[2].style.zIndex = 21000
    //     }
    //   }
    // }, [menuIsOpen])

    const realvalue = valueTransform(options, value, isMulti, type)
    const extra =
      isMulti && isArray(value)
        ? value.filter((item) => options.map((option) => option.value).indexOf(item) === -1)
        : undefined

    // 重写Option
    const Option = (props) => {
      const {data, children} = props
      const {remark} = data

      return (
        <components.Option {...props}>
          <div className={c('fbv fbjc w100p', {h24: isMulti, lh24: isMulti})}>
            <div className={c('wsnp', {oh: isMulti, [s.label]: isMulti})}>{children}</div>
            {hasRemark && remark && <div className="mt4 omit">{remark}</div>}
          </div>
        </components.Option>
      )
    }

    // Todo filter点击选项时有事件需要阻止menu打开
    const MultiValueLabel = (props) => {
      return (
        <div
          className="hand"
          onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onAction({event: e})
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
                {/* <IconButton icon="close" iconSize={8} buttonSize={19} className={s.close} width={24} onClick={() => {
        }} /> */}
              </div>
            ))}
          {children}
        </components.ValueContainer>
      )
    }

    return (
      <Field label={label} tip={tip} className={className}>
        <div
          ref={selectRef}
          className={c('w100p h100p fbh fbac fbjc pr', {[s.filter]: isMulti})}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Select
            // 重构子组件
            components={{
              ...(type === 'basic-select' ? {Option, MultiValueLabel, ValueContainer} : resetChildrenComponents),
              Menu,
            }}
            // 加这个key 是为了解决当 value 设置为 undefined 时，仍然会保留上一次的选中项
            key={`${typeof realvalue === 'undefined'}`}
            styles={customStyles({
              type,
              maxMenuHeight,
              readOnly,
              readOnlyHighLight,
              hasRemark,
              isMulti,
            })}
            options={opTransform(options)}
            onChange={(selectedOption) => {
              const v = JSON.parse(JSON.stringify(selectedOption))
              if (isMulti) {
                onChange(
                  v?.map((o) => o.value),
                  v?.map((o) => o.data)
                )
              } else {
                onChange(v?.value, v?.data)
              }
            }}
            placeholder={placeholder}
            // value={valueTransform(options, value, isMulti)}
            value={realvalue}
            defaultValue={valueTransform(options, defaultValue, isMulti, type)}
            isDisabled={readOnly || readOnlyHighLight}
            isClearable={allowClear}
            isMulti={isMulti}
            isSearchable={false}
            // TODO 滚动文档关闭菜单
            closeMenuOnScroll={() => isCloseMenuOnScroll}
            // 菜单栏打开
            // menuIsOpen
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
          {!isMulti && (
            <div className={c('pa', s.drop)}>
              <Icon name="arrow-down" fill="rgba(255, 255, 255, 0.5)" size={8} />
            </div>
          )}
        </div>
      </Field>
    )
  }
)

// 选项转换函数
export const opTransform = (options = []) => {
  return options.map((item) => ({
    label: item.key,
    value: item.value,
    data: item.data,
    thumbnail: item.thumbnail,
    remark: item.remark,
  }))
}
// 选中值转换函数
export const valueTransform = (options = [], selectValue, isMulti, type) => {
  if (typeof selectValue === 'undefined') {
    return undefined
  }

  if (isMulti) {
    // options中取出选择过滤的选项数组
    const selectFilter = options
      .filter((o) => selectValue.indexOf(o.value) > -1)
      .map((o) => ({
        label: o.key,
        value: o.value,
        data: o.data,
        thumbnail: o.thumbnail,
        remark: o.remark,
      }))
    // 按照selectValue数组的顺序排序
    return selectFilter.sort((prev, next) => selectValue.indexOf(prev.value) - selectValue.indexOf(next.value))
  }

  const currentValue =
    type !== 'select-gradient-color'
      ? options.find((o) => o.value === selectValue)
      : options.find((o) => isEqual(o.value, selectValue))

  return (
    currentValue && {
      label: currentValue.key,
      value: currentValue.value,
      data: currentValue.data,
      thumbnail: currentValue.thumbnail,
      remark: currentValue.remark,
    }
  )
}

const customStyles = ({
  type = 'basic-select',
  maxMenuHeight = 200,
  readOnly = false,
  readOnlyHighLight = false,
  hasRemark,
  isMulti,
}) => {
  return {
    option: (provided, state) => {
      const optionStyle = {
        'basic-select': {
          padding: 8,
          height: hasRemark ? 'auto' : '24px',
          backgroundColor: state.isSelected ? '#07f' : 'transparent',
          display: 'flex',
          alignItems: 'center',
        },
        'select-gradient-color': {
          height: 24,
          padding: 4,
          // border: state.isSelected ? '1px dashed #ffffff' : undefined,
          backgroundColor: state.isSelected ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
          ':hover': {
            backgroundColor: state.isSelected ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.1)',
          },
        },
        'select-theme-color': {
          height: 24,
          paddingLeft: 4,
          // border: state.isSelected ? '1px dashed #ffffff' : undefined,
          display: 'flex',
          backgroundColor: state.isSelected ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
          ':hover': {
            backgroundColor: state.isSelected ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.1)',
          },
        },
        'select-thumbnail': {
          marginRight: +state.innerProps.id.slice(-1) % 3 === 2 ? 0 : 1,
          padding: 4,
          // border: state.isSelected ? '1px dashed #ffffff' : 'none',
          pointerEvents: state.isDisabled ? 'none' : 'auto',
          borderBottom: 'none',
          backgroundColor: state.isSelected ? 'rgba(255, 255, 255, 0.1)' : '#454545',
          ':hover': {
            backgroundColor: state.isSelected ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
          },
          // backgroundColor: '#454545',
        },
        'select-filter': {},
      }
      return {
        ...provided,
        // 单选时isSelected有效
        // color: state.isSelected ? 'rgba(255, 255, 255, 0.6)' : '#ffffff',
        // paddingLeft: 10,
        // pointerEvents: state.isSelected ? 'none' : 'auto',
        cursor: state.isSelected ? 'not-allowed' : 'auto',
        ':hover': {
          backgroundColor: state.isSelected ? '#07f' : 'rgba(255, 255, 255, 0.1)',
        },
        borderBottom: state.data.label !== state.options.slice(-1)[0].label ? '1px solid #1B1B1B' : 'none',
        backgroundColor: 'transparent',
        ...optionStyle[type],
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
      const controlStyle = {
        'select-gradient-color': {
          borderBottomWidth: state.hasValue ? 0 : 1,
        },
        'select-theme-color': {
          borderBottomWidth: state.hasValue ? 0 : 1,
        },
        'select-thumbnail': {
          borderBottomWidth: state.hasValue ? 0 : 1,
        },
      }
      return {
        ...provided,
        minHeight: '24px',
        height: isMulti ? 'auto' : '24px',
        lineHeight: 'normal',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        ':hover': {
          borderBottomColor: '#07f',
        },
        borderBottom: state.isFocused ? '1px solid #07f' : '1px solid rgba(255, 255, 255, 0.1)',
        ...controlStyle[type],
        // 与menu同个层叠上下文
        // zIndex: 0,
      }
    },

    valueContainer: (provided) => ({
      ...provided,
      minHeight: '24px',
      padding: 0,
      paddingRight: isMulti ? '24px' : 0,
    }),

    input: (provided) => ({
      ...provided,
      outline: 'none',
      margin: 0,
      padding: 0,
      color: readOnly ? '#bbb' : '#FFFFFF',
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
      maxHeight: `${maxMenuHeight}px`,
      '::-webkit-scrollbar-thumb': {
        backgroundColor: '#07f',
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: type === 'select-thumbnail' ? '#454545' : 'transparent',
      },
      backgroundColor: type === 'select-thumbnail' ? 'rgb(0, 0, 0)' : 'transparent',
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
      backgroundColor: readOnlyHighLight ? 'rgb(0, 126, 255)' : readOnly ? 'rgba(85, 85, 85)' : 'rgb(0, 126, 255)',
      height: '19px',
      borderRadius: '8px',
      alignItems: 'center',
      marginRight: '4px',
      marginLeft: '0px',
      maxWidth: '150px',
    }),

    multiValueRemove: (provided) => ({
      ...provided,
      display: readOnly || readOnlyHighLight ? 'none' : 'flex',
      height: '19px',
      paddingLeft: '2.5px',
      paddingRight: '2.5px',
    }),

    multiValueLabel: (provided) => ({
      ...provided,
      color: '#FFFFFF',
      opacity: readOnly ? 0.5 : 1,
      paddingLeft: readOnly ? '8px' : '6px',
      paddingRight: readOnly ? '8px' : '3px',
    }),

    placeholder: (provided) => ({
      ...provided,
      margin: 0,
      padding: 4,
      display: isMulti ? 'none' : 'block',
    }),

    singleValue: (provided) => {
      const singleValueStyle = {
        'basic-select': {
          padding: 0,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          paddingRight: '16px',
        },
        'select-gradient-color': {
          maxWidth: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        'select-theme-color': {
          maxWidth: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        'select-thumbnail': {
          maxWidth: '100%',
          padding: 0,
        },
      }
      return {
        ...provided,
        color: '#FFFFFF',
        opacity: readOnly ? 0.5 : 1,
        margin: 0,
        padding: 4,
        width: !isMulti ? '100%' : 'auto',
        height: !isMulti ? '100%' : 'auto',
        ...singleValueStyle[type],
      }
    },
  }
}
