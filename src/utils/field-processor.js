import isDef from "./is-def"
// import makeFunction from './make-function'

const defaultDataProcessor = `
// @param inputData {object} 输入数据
return function (inputData) {
  // 默认不做任何处理，直接将输入数据返回
  const outputData = inputData
  return outputData
}`

// 自定义函数模版
const getProcessorFunction = (
  useProcessor = false,
  defaultValue,
  processorCode = defaultDataProcessor,
  hasSaveCode = false
) => {
  try {
    // 数组类型需要转换为json字符串
    const value = Array.isArray(defaultValue)
      ? JSON.stringify(defaultValue)
      : defaultValue
    return `return function (inputData, useProcessor = ${useProcessor}, defaultValue = '${value}', hasSaveCode = ${hasSaveCode}) {
      if (useProcessor) {
        ${processorCode}(inputData)
      } else {
        try {
          return JSON.parse(${
            typeof defaultValue === "number" ? "+defaultValue" : "defaultValue"
          })
        } catch (error) {
          return defaultValue
        }
      }
    }`
  } catch (error) {
    return defaultValue
  }
}

// 获取函数value中defaultValue的默认值
const getDefaultValue = (value, type) => {
  if (!valueIsFunction(value)) {
    return value
  }
  const sliceCode = value.slice(
    value.indexOf("defaultValue ="),
    value.indexOf(", hasSaveCode")
  )
  const defaultValueIndex = sliceCode.indexOf("'")
  const valueStr = sliceCode.slice(defaultValueIndex + 1, -1)
  // 根据field type类型获取相应类型返回值
  switch (type) {
    case "switch":
      // 返回布尔值
      return Boolean(valueStr)
    case "number":
      // 返回值number类型 || JSON.parse(valueStr)
      return +valueStr
    case "text":
    case "color":
      if (valueStr === "undefined") {
        return undefined
      }
      // 除去截取字符串内部包裹默认值的双引号
      // 返回值string类型
      return valueStr
    case "multiNumber":
    case "rangeColor":
      // 返回数组, JSON.parse解析"[]"
      return JSON.parse(valueStr)
    case "select":
    case "check":
      if (valueStr === "undefined") {
        return undefined
      }
      // 判断字符串是否全为数字
      if (/^\d+$/.test(valueStr)) {
        return +valueStr
      }
      return valueStr
    case "filter":
      if (valueStr === "undefined") {
        return undefined
      }
      // 判断字符串是否全为数字
      if (/^\d+$/.test(valueStr)) {
        return +valueStr
      }
      try {
        // 获取数组值
        return Array.isArray(JSON.parse(valueStr))
          ? JSON.parse(valueStr)
          : valueStr
      } catch (error) {
        // 不是数组时返回字符串
        return valueStr
      }
    default:
      console.warning("当前类型不支持")
      try {
        return JSON.parse(valueStr)
      } catch (error) {
        return valueStr
      }
  }
}

// 获取函数value中useProcessor的默认值
const getUseProcessor = (value) => {
  if (!valueIsFunction(value)) {
    return false
  }
  const sliceCode = value.slice(
    value.indexOf("useProcessor ="),
    value.indexOf(", defaultValue")
  )
  return Boolean(JSON.parse(sliceCode.split(" ")[2]))
}

const getHasSaveCode = (value) => {
  if (!valueIsFunction(value)) {
    return false
  }
  const sliceCode = value.slice(
    value.indexOf("hasSaveCode ="),
    value.indexOf(") {")
  )
  return Boolean(JSON.parse(sliceCode.split(" ")[2]))
}

// 获取函数value中的processorCode默认值
const getProcessorCode = (value, defaultGisDataProcessor) => {
  if (!valueIsFunction(value)) {
    return defaultGisDataProcessor || defaultDataProcessor
  }
  const sliceCode = value.slice(
    value.indexOf("if (useProcessor) {"),
    value.indexOf("}(inputData)") + 1
  )
  return sliceCode.slice(
    sliceCode.indexOf("// @param") > -1
      ? sliceCode.indexOf("// @param")
      : sliceCode.indexOf("return")
  )
}

// 获取当前value值是否是函数字符串
const valueIsFunction = (value) => {
  if (!isDef(value)) {
    return false
  }
  const valueJson = JSON.stringify(value)
  return (
    ((valueJson.indexOf("function") > -1 && valueJson.indexOf("{") > -1) ||
      (valueJson.indexOf("=>") > -1 && valueJson.indexOf("{") > -1)) &&
    valueJson.indexOf("}") > -1 &&
    (valueJson.indexOf("\\n") > -1 || valueJson.indexOf("\n") > -1)
  )
}

export {
  defaultDataProcessor,
  getProcessorFunction,
  getDefaultValue,
  getProcessorCode,
  getUseProcessor,
  getHasSaveCode,
  valueIsFunction
}
