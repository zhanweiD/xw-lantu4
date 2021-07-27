import React from "react"
import {observer} from "mobx-react-lite"
import {components} from "react-select"
import isArray from "lodash/isArray"
import {SelectField} from "./select"

const transformColor = (data) => {
  const colors = data.map((color) => {
    if (isArray(color)) {
      return `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    }
    return color
  })
  return colors
}

export const SelectGradientColorField = observer((props) => {
  return (
    <SelectField {...props} resetChildrenComponents={{Option, SingleValue}} />
  )
})

const Option = (props) => {
  const {data} = props
  const background = `linear-gradient(to right, ${transformColor(
    data.value
  ).join()})`
  return (
    <components.Option {...props}>
      <div className="wh100p" style={{background}} />
    </components.Option>
  )
}

// 重构Select组件中的singleValue子组件
const SingleValue = ({...props}) => {
  const {data} = props
  const background = `linear-gradient(to right, ${transformColor(
    data.value
  ).join()})`
  return (
    <components.SingleValue {...props}>
      <div className="wh100p" style={{background}} />
    </components.SingleValue>
  )
}
