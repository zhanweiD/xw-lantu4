import {sum} from 'd3'

/**
 * @description 传入一个数组，计算数组中值的百分比，最后一个值会处理成（1 - 前面的百分比总和）
 * @export
 * @param {any[]} arr 数据数组
 * @param {() => number} accessor arr的格式不固定，所以传入一个访问器函数，说明取哪一个值
 * @param {number} precision 小数位数
 * @return {number[]} 返回百分比值数组，不带百分比
 */
export function computePercent(arr, accessor = (d) => d, precision = 1) {
  // 取值，做一些处理，非数值处理成0，并仅取绝对值
  const getValue = (item) => Math.abs(+accessor(item) || 0)

  const lastIndex = arr.length - 1

  const sumValue = sum(arr, accessor)

  // 总和为0，那就全是0
  if (!sumValue) {
    return arr.map(() => 0)
  }

  return arr.reduce((percents, curItem, index) => {
    let percent = 0
    // 最后一个，用100减去之前其他数的总和
    if (index === lastIndex) {
      percent = 100 - sum(percents)
      percent = toPrecision(percent) // 可能出现浮点数计算问题，处理一下
    } else {
      const value = getValue(curItem) * 100

      percent = toPrecision(value / sumValue, precision)
    }

    percents.push(percent)
    return percents
  }, [])
}

/**
 * @description 将数值精确到多少小数位数
 * @param {number} value 数值
 * @param {number} [precision=1]
 * @return {number} 精确到precision小数位数的值
 */
export function toPrecision(value, precision = 1) {
  const multiple = Math.pow(10, precision)
  return Math.round(value * multiple) / multiple
}

/**
 * @description 计算两个值相除的百分比值，结果是数值，不含百分号
 * @export
 * @param {number} dividend 被除数
 * @param {number} divisor 除数
 * @param {number} [precision=2] 小数位数
 * @returns {number} 计算后的百分比值
 */
export function toPercent(dividend, divisor, precision = 2) {
  if (!dividend) {
    console.error('被除数不能必须是非0数值：', dividend)
    return divisor
  }
  return toPrecision((divisor / dividend) * 100, precision)
}
