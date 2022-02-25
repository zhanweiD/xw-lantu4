import * as d3 from 'd3'

/**
 * 金额数据格式化
 *
 * @param {number} d
 * @returns {(number | string)}
 * @memberof Base
 */
export function formatMoney(d) {
  if (d >= 1000) {
    return `${(d / 1000).toFixed(1)}k`
  }

  return d
}

/**
 * 百分比数据格式化
 *
 * @param {number} d
 * @returns {string}
 * @memberof Base
 */
export function formatPercent(d) {
  return d3.format('.1%')(d)
}

/**
 * 千分位数据格式化
 *
 * @param {number} d
 * @returns {(number | string)}
 * @memberof Base
 */
export function formatNumber(d) {
  if (this.config('isFormatK')) {
    return d3.format(',')(d)
  }
  return d
}
