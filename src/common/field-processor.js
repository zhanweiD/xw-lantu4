import {defaultDataProcessor} from '../models/util'
import isDef from './is-def'
import makeFunction from './make-function'

// 验证函数执行输出值
const verifyOutputData = (value, type, defaultValue, options = [], isShowTip) => {
  const {tip} = window.waveview
  // 根据field type类型获取相应类型返回值
  switch (type) {
    case 'switch':
      if (Object.prototype.toString.call(value) !== '[object Boolean]') {
        isShowTip && tip.warning({content: '返回值应为布尔值, 无效处理!'})
        return defaultValue
      }
      return value
    case 'number':
      if (Object.prototype.toString.call(value) !== '[object Number]') {
        isShowTip && tip.warning({content: '返回值应为数值, 无效处理!'})
        return defaultValue
      }
      return value
    case 'text':
    case 'color':
      if (Object.prototype.toString.call(value) === '[object Undefined]') {
        isShowTip && tip.warning({content: '返回值未定义!'})
        return value
      }
      if (Object.prototype.toString.call(value) !== '[object String]') {
        isShowTip && tip.warning({content: '返回值应为字符串, 无效处理!'})
        return defaultValue
      }
      return value
    case 'multiNumber':
    case 'rangeNumber':
    case 'rangeColor':
    case 'padding':
      if (Object.prototype.toString.call(value) !== '[object Array]') {
        isShowTip && tip.warning({content: '返回值应为数组, 无效处理!'})
        return defaultValue
      }
      return value
    case 'select':
    case 'check':
      if (Object.prototype.toString.call(value) === '[object Undefined]') {
        isShowTip && tip.warning({content: '返回值未定义!'})
        return value
      }
      if (Object.prototype.toString.call(value) !== '[object String]' && Object.prototype.toString.call(value) !== '[object Number]') {
        isShowTip && tip.warning({content: '返回值应为数值或字符串, 无效处理!'})
        return defaultValue
      }
      // 此时value为数值或字符串
      if (options.findIndex(o => o.value === value) === -1) {
        isShowTip && tip.warning({content: '返回值应在选项列表内, 无效处理!'})
        return defaultValue
      }
      return value
    case 'filter':
      if (Object.prototype.toString.call(value) === '[object Undefined]') {
        isShowTip && tip.warning({content: '返回值未定义!'})
        return value
      }
      if (Object.prototype.toString.call(value) !== '[object Array]') {
        isShowTip && tip.warning({content: '返回值应为数组, 无效处理!'})
        return defaultValue
      }
      // 此时value为数组
      // eslint-disable-next-line no-case-declarations
      let isInOption = true
      value.forEach(item => {
        if (options.findIndex(o => o.value === item) === -1) {
          isInOption = false
        }
      })
      if (!isInOption) {
        isShowTip && tip.warning({content: '返回值应在选项列表内, 无效处理!'})
        return defaultValue
      }
      return value
    default:
      console.warning('当前类型不支持')
  }
}

// 自定义函数模版
const getValueFunction = (useProcessor = false, fieldType = 'text', defaultValue, processorCode = defaultDataProcessor, options = [], isOnFocusOpenProcessor = false) => {
  try {
    // 数组类型需要转换为json字符串
    const value = Array.isArray(defaultValue) ? JSON.stringify(defaultValue) : defaultValue
    return `return function (inputData, useProcessor = ${useProcessor}, fieldType = '${fieldType}', defaultValue = '${value}', options = ${JSON.stringify(options)}, isShowTip = ${isOnFocusOpenProcessor}) {
      if (useProcessor) {
        ${processorCode}(inputData)
      } else {
        try {
          return JSON.parse(${fieldType === 'number' ? 'Number(defaultValue)' : 'defaultValue'})
        } catch (error) {
          return defaultValue
        }
      }
    }`
  } catch (error) {
    return defaultValue
  }
}

// 获取校验函数执行后的value返回值, 忽略第二参数则以输入值为处理函数参数
const getVerifiedValue = (value, inputData) => {
  const {tip} = window.waveview
  const fieldType = getFieldType(value)
  const options = getOptions(value)
  const defaultValue = getDefaultValue(value, fieldType)
  const isShowTip = getIsShowTip(value)
  try {
    if (valueIsFunction(value)) {
      if (!getUseProcessor(value)) {
        return defaultValue
      }
      // 忽略第二参数则以输入值为处理函数参数
      const outputData = isDef(inputData) ? makeFunction(value)(inputData) : makeFunction(value)(defaultValue)
      return verifyOutputData(outputData, fieldType, defaultValue, options, isShowTip)
    }
    return value
  } catch (error) {
    tip.error({content: '自定义函数错误,无效处理!'})
    console.error(error)
    // 自定义函数错误，返回defaultValue,即函数处理无效
    return defaultValue
  }
}

// 获取函数value中defaultValue的默认值
const getDefaultValue = (value, type) => {
  if (!valueIsFunction(value)) {
    return value
  }
  const sliceCode = value.slice(value.indexOf('defaultValue'), value.indexOf(', options'))
  const valueStr = sliceCode.split(' ')[2].slice(1, -1)

  // 根据field type类型获取相应类型返回值
  switch (type) {
    case 'switch':
      // 返回布尔值
      return Boolean(valueStr)
    case 'button':
    case 'number':
      // 返回值number类型 || JSON.parse(valueStr)
      return Number(valueStr)
    case 'text':
    case 'color':
      if (valueStr === 'undefined') {
        return undefined
      }
      // 返回数组类型
      if (typeof valueStr === 'string' && valueStr.indexOf('[') === 0 && valueStr.indexOf(']') > 0) {
        return JSON.parse(valueStr)
      }
      // 除去截取字符串内部包裹默认值的双引号
      // 返回值string类型
      return valueStr
    case 'multiNumber':
    case 'rangeNumber':
    case 'rangeColor':
    case 'padding':
      // 返回数组, JSON.parse解析"[]"
      return JSON.parse(valueStr)
    case 'select':
    case 'check':
      if (valueStr === 'undefined') {
        return undefined
      }
      // 判断字符串是否全为数字
      if (/^\d+$/.test(valueStr)) {
        return Number(valueStr)
      }
      return valueStr
    case 'filter':
      if (valueStr === 'undefined') {
        return undefined
      }
      // 判断字符串是否全为数字
      if (/^\d+$/.test(valueStr)) {
        return Number(valueStr)
      }
      try {
        // 获取数组值
        return Array.isArray(JSON.parse(valueStr)) ? JSON.parse(valueStr) : valueStr
      } catch (error) {
        // 不是数组时返回字符串
        return valueStr
      }
    default:
      console.warning('当前类型不支持')
      return valueStr
  }
  // return type.indexOf('number') > -1 ? Number(sliceCode.split(' ')[2].replace(/\'/g, '')) : sliceCode.split(' ')[2].replace(/\'/g, '')
}
// 获取函数value中的options默认值
const getOptions = value => {
  if (!valueIsFunction(value)) {
    return []
  }
  const sliceCode = value.slice(value.indexOf('options'), value.indexOf(', isShowTip'))
  return JSON.parse(sliceCode.split(' ')[2])
}

// 获取函数value中的fieldType默认值
const getFieldType = value => {
  if (!valueIsFunction(value)) {
    return ''
  }
  const sliceCode = value.slice(value.indexOf('fieldType'), value.indexOf(', defaultValue'))
  return sliceCode.split(' ')[2].slice(1, -1)
}

// 获取函数value中useProcessor的默认值
const getUseProcessor = value => {
  if (!valueIsFunction(value)) {
    return false
  }
  const sliceCode = value.slice(value.indexOf('useProcessor'), value.indexOf(', fieldType'))
  return Boolean(JSON.parse(sliceCode.split(' ')[2]))
}

// 获取函数value中的processorCode默认值
const getProcessorCode = (value, defaultGisDataProcessor) => {
  if (!valueIsFunction(value)) {
    return defaultGisDataProcessor || defaultDataProcessor
  }
  const sliceCode = value.slice(value.indexOf('if (useProcessor) {'), value.indexOf('}(inputData)') + 1)
  return sliceCode.slice(sliceCode.indexOf('// @param') > -1 ? sliceCode.indexOf('// @param') : sliceCode.indexOf('return'))
}

const getIsShowTip = value => {
  if (!valueIsFunction(value)) {
    return false
  }
  const sliceCode = value.slice(value.indexOf('isShowTip'), value.indexOf(') {'))
  return Boolean(JSON.parse(sliceCode.split(' ')[2]))
}

// 判断数据是否为函数， 待删除
const getValueIsFunction = value => {
  if (!isDef(value)) {
    return false
  }
  const valueJson = JSON.stringify(value)
  return ((valueJson.indexOf('function') > -1 && valueJson.indexOf('{') > -1) || (valueJson.indexOf('=>') > -1 && valueJson.indexOf('{') > -1))
    && valueJson.indexOf('}') > -1 && (valueJson.indexOf('\\n') > -1 || valueJson.indexOf('\n') > -1)
}

// 获取当前value值是否是函数字符串
const valueIsFunction = value => {
  return getValueIsFunction(value)
}

export {
  getVerifiedValue,
  getValueFunction,
  getDefaultValue,
  getFieldType,
  getProcessorCode,
  getUseProcessor,
  getOptions,
  getIsShowTip,
  getValueIsFunction,
  valueIsFunction,
}
