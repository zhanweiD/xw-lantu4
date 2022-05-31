import React, {useEffect, useState} from 'react'
import {types} from 'mobx-state-tree'
import {observer} from 'mobx-react-lite'
import {MUIBase} from '../ui-base'
import Icon from '../../components/icon'
import s from './search.module.styl'
import c from 'classnames'

const MSearch = MUIBase.named('MSearch')
  .props({
    text: types.maybe(types.string),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.key = 'uiSearch'
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

      const style = {}
      ;[
        'width',
        'height',
        'fontColor',
        'fontSize',
        'backgroundColor',
        'radius',
        'iconWidth',
        'iconBackgroundColor',
        'searchIconColor',
      ]?.forEach((name) => (style[name] = self.config(name)))

      const iconStyle = {
        width: style.iconWidth,
        size: style.width / 14,
        color: style.searchIconColor,
        backgroundColor: style.iconBackgroundColor,
      }

      // 渲染组件
      self.render(<ConfiguredSearch self={self} style={style} iconStyle={iconStyle} />)
    }

    return {
      draw,
      drawFallback,
      afterCreate,
    }
  })

const ConfiguredSearch = observer(({self, style, iconStyle}) => {
  const [isVisible, setIconVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue(self.text)
  }, [self.text])

  // 改变 input 内容
  const onChange = (e) => {
    setInputValue(e.target.value)
  }

  // 当搜索按钮被点击
  const onSearch = () => {
    self.event.fire('onClickSearchButton', {data: inputValue})
  }

  const divStyle = {
    ...style,
    fontSize: style.width / 14,
  }

  return (
    <div>
      <div
        className={c('w100p', s.container)}
        style={{...divStyle, borderRadius: style.radius}}
        onMouseOver={() => setIconVisible(true)}
        onMouseLeave={() => setIconVisible(false)}
      >
        <input
          value={inputValue}
          onChange={onChange}
          placeholder={self.config('placeholder')}
          style={{...divStyle, marginLeft: '8px', border: 'none', color: style.fontColor, padding: '0 10px'}}
        />
        <span
          className={s.falseIcon}
          style={{
            display: isVisible ? 'block' : 'none',
            fontSize: iconStyle.size,
          }}
          onClick={() => setInputValue('')}
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
        <div onClick={onSearch} className={s.icon} style={{...iconStyle, cursor: 'pointer', padding: '7px'}}>
          <Icon name="search" fill={iconStyle.color} size={iconStyle.size} />
        </div>
      </div>
    </div>
  )
})

export default MSearch
