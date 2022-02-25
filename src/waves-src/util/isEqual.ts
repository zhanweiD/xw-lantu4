import {isArray, isObject} from './is'

/**
 * @description 对比两个值是否相等。原始类型采用严格比较（===）；数组和对象只比较可枚举的属性
 * @date 2019-07-03
 * @export
 * @param {*} value 第一个值
 * @param {*} other 拿来比较的第二个值
 * @param {boolean} [deep=false] 如果deep为true，那么会深度比较数组和对象
 * @returns boolean
 * @补充 没有对数据深度做限制，所以避免参与对比的数据层级过深
 */
export default function isEqual(value, other, deep = false) {
  // 先直接比较
  if (value === other) {
    return true
  }
  // 如果两个都是NaN
  // if (isNaN(value) && isNaN(other)) { // eslint-disable-line
  //   return true
  // }

  // 如果不是同为数组也不是同为对象，那么返回false
  if (!(isArray(value) && isArray(other)) && !(isObject(value) && isObject(other))) {
    return false
  }

  // Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，对于数组和对象都可用
  // obj.hasOwnProperty() 也同样可用于数组

  // 获取二者的keys数组
  const keysInValue = Object.keys(value)
  const keysInOther = Object.keys(other)

  // 键数组长度不一致，直接返回false
  if (keysInValue.length !== keysInOther.length) {
    return false
  }

  // 使用every函数，只有全部相同才ok
  return keysInValue.every(key => {
    // 如果 other 中不包含这个属性，直接返回false
    if (!other.hasOwnProperty(key)) {
      return false
    }

    // 如果要深度比较，那么递归比较
    if (deep === true) {
      return isEqual(value[key], other[key], deep)
    }
    // 不深度比较，就只比较第一层
    return value[key] === other[key]
  })
}
