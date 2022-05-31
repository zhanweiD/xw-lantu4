import React from 'react'
import {observer} from 'mobx-react-lite'
import {components} from 'react-select'
import c from 'classnames'
import chroma from 'chroma-js'
import {SelectField} from './select'
import s from './select-theme-color.module.styl'

export const SelectThemeColorField = observer((props) => {
  return <SelectField {...props} resetChildrenComponents={{Option, SingleValue}} />
})

const Option = (props) => {
  const {data, children} = props
  const chromaJs = chroma.scale(data.data).domain([0, 8])
  const colors = data.data

  return (
    <components.Option {...props}>
      <div className="fbh fbac w100p">
        <div className="fbh fbac">
          {Array.from({length: 9}).map((item, index) => (
            <div
              key={`${data.value}-${colors[index]}`}
              className={s.rect}
              style={{background: chromaJs(index).hex()}}
            />
          ))}
        </div>
        <span className="pl8 omit">{children}</span>
      </div>
    </components.Option>
  )
}

// 重构Select组件中的singleValue子组件
const SingleValue = ({children, ...props}) => {
  const {data} = props
  const chromaJs = chroma.scale(data.data).domain([0, 8])
  const colors = data.data

  return (
    <components.SingleValue {...props}>
      <div className={c('wh100p fbh fbac')}>
        <div className="fbh fbac">
          {Array.from({length: 9}).map((item, index) => (
            <div
              key={`${data.value}-${colors[index]}`}
              className={s.rect}
              style={{background: chromaJs(index).hex()}}
            />
          ))}
        </div>
        <span className="pl8 omit">{children}</span>
      </div>
    </components.SingleValue>
  )
}
