import React, {useEffect, useState} from 'react'
import {types} from 'mobx-state-tree'
import {observer} from 'mobx-react-lite'
import {MUIBase} from '../ui-base'
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
        'placeholder',
        'content',
      ]?.forEach((name) => (style[name] = self.config(name)))

      const iconStyle = {
        width: style.iconWidth,
        size: style.width / 20,
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
  const [selectBorders, setSelectBorders] = useState(false)

  useEffect(() => {
    setInputValue(self.text)
  }, [self.text])

  useEffect(() => {
    setInputValue(style.content)
  }, [style.content])

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
    fontSize: style.width / style.height > 9 ? style.width / 25 : style.width / 20,
  }

  return (
    <div>
      <div
        className={c('w100p', s.container)}
        style={{
          ...divStyle,
          borderRadius: style.radius,
          border: `2px solid ${selectBorders ? 'rgb(0,127,212)' : '#999'}`,
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
          placeholder={style.placeholder}
          style={{...divStyle, marginLeft: '8px', border: 'none', color: style.fontColor, padding: '0 10px'}}
        />

        {/* 删除Icon */}
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
            width="0.5em"
            height="0.5em"
            aria-hidden="true"
          >
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
          </svg>
        </span>

        {/* 搜索Icon */}
        <div onClick={onSearch} className={s.icon} style={{...iconStyle, cursor: 'pointer', padding: '7px'}}>
          <svg
            t="1654592263757"
            className={s.searchSvg}
            style={{
              width: '1em',
              height: '1em',
              verticalAlign: 'middle',
              fill: iconStyle.color,
              overflow: 'hidden',
              fontWeight: 'bold',
            }}
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1308"
            width="32"
            height="32"
          >
            <path
              d="M955.069071 864.311021 740.015134 649.258107c-3.752464-3.751441-8.841366-5.860475-14.149255-5.860475-5.306866 0-10.395768 2.108011-14.149255 5.860475l-16.692171 16.692171-38.34226-38.34226c53.03796-59.810201 85.298711-138.442072 85.298711-224.478588 0-186.774871-151.952784-338.727655-338.727655-338.727655S64.527642 216.35456 64.527642 403.12943c0 186.775894 151.952784 338.728678 338.727655 338.728678 86.36909 0 165.276231-32.510438 225.170343-85.913718l38.303374 38.303374-17.34504 17.34504c-7.812943 7.813966-7.812943 20.48352 0 28.297486l215.051891 215.052914c3.753487 3.751441 8.841366 5.860475 14.149255 5.860475 5.306866 0 10.395768-2.108011 14.149255-5.860475l62.334697-62.334697C962.883037 884.794541 962.883037 872.124987 955.069071 864.311021zM104.546078 403.12943c0-164.709319 133.9999-298.709219 298.709219-298.709219s298.709219 133.9999 298.709219 298.709219S567.964616 701.839673 403.255297 701.839673 104.546078 567.838749 104.546078 403.12943zM878.585119 912.496463 691.829691 725.741036l34.036187-34.036187 186.755428 186.755428L878.585119 912.496463z"
              p-id="1309"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  )
})

export default MSearch
