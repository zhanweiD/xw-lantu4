import {cloneDeep} from "lodash"

// 给子层模板注入默认值
const createChildren = (template, defaultValues) => {
  const children = cloneDeep(template)
  children.forEach((subLayer) => {
    const {option, tabId} = subLayer
    const target = subLayer[tabId]
    Object.keys(target).forEach((key) => {
      if (
        defaultValues &&
        defaultValues[option] &&
        defaultValues[option][key]
      ) {
        target[key].defaultValue = defaultValues[option][key]
      }
    })
  })
  return children
}

// 给其他模板注入默认值
const createOther = (template, defaultValues) => {
  const other = cloneDeep(template)
  other.fields.forEach(({option, field}) => {
    if (defaultValues && defaultValues[option]) {
      field.defaultValue = defaultValues[option]
    }
  })
  return other
}

export {createChildren, createOther}
