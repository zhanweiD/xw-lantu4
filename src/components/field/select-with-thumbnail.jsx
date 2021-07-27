import React from "react"
import {observer} from "mobx-react-lite"
import c from "classnames"
import {components} from "react-select"
import Grid from "@components/grid"
import {SelectField} from "./select"
import s from "./select-with-thumbnail.module.styl"

export const SelectWithThumbnailField = observer((props) => {
  return (
    <SelectField
      {...props}
      options={
        props.options.length % 3 !== 0
          ? props.options.concat(
              Array.from({length: 3 - (props.options.length % 3)}).map(
                () => ({})
              )
            )
          : props.options
      }
      resetChildrenComponents={{Option, SingleValue, MenuList}}
    />
  )
})

const Option = (props) => {
  const {data} = props
  return (
    <components.Option {...props} isDisabled={!data.label}>
      <Grid.Item key={data.key}>
        <div
          className={c("pa", s.icon, s.position)}
          style={{backgroundImage: `url(${data.thumbnail})`}}
        />
        <div className={c("pa", s.optionText)}>{data.label}</div>
      </Grid.Item>
    </components.Option>
  )
}
// 重构Select组件中的singleValue子组件
const SingleValue = ({children, ...props}) => {
  const {data} = props
  return (
    <components.SingleValue {...props}>
      <div className="w40 h24 cfw10 fbh fbac fbjc">
        <div
          className={c("w32", s.iconHeight, s.icon)}
          style={{backgroundImage: `url(${data.thumbnail})`}}
        />
      </div>
      <div className={c("h24 pa fbh fbac", s.bottomLine)}>{children}</div>
    </components.SingleValue>
  )
}

// 重构Select组件中的MultiList子组件
const MenuList = (props) => {
  const {children} = props
  return (
    <components.MenuList {...props}>
      <Grid column={3}>{children}</Grid>
    </components.MenuList>
  )
}
