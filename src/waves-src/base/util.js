export const NULL = null
export const TRUE = true
export const FALSE = !TRUE
export const UNDEFINED = 'undefined'
export const EMPTY = ''

const {toString} = Object.prototype
const ARRAY_TYPE = '[object Array]'
const ctx = document.createElement('canvas').getContext('2d')
const STYLE = {FONT_FAMILY: "'PingFang SC', 'Helvetica Neue', Helvetica, Tahoma, Helvetica, sans-serif"}

export function noop(v) {
  return v
}

export function isBoolean(v) {
  return typeof v === 'boolean'
}

export function isString(v) {
  return typeof v === 'string'
}

export function isFunction(v) {
  return typeof v === 'function'
}

export function runAsFn(v) {
  return isFunction(v) ? v() : v
}

export function isNumber(v) {
  return typeof v === 'number'
}

export function isObject(v) {
  return typeof v === 'object' && v !== NULL
}

export function isWindow(v) {
  return v !== NULL && v === v.window
}

// 参考了zepto
export function isPlainObject(v) {
  return v !== NULL && isObject(v) && !isWindow(v) && Object.getPrototypeOf(v) === Object.prototype
}

export function isEmptyObject(v) {
  return Object.keys(v).length === 0
}

export function isArray(v) {
  return toString.call(v) === ARRAY_TYPE
}

// 随机字符串字符集
const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'

// 创建随机字符串
export function makeRandom(n = 6) {
  let str = ''
  for (let i = 0; i < n; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return str
}

function reserveString(str) {
  return str.split(EMPTY).reverse().join(EMPTY)
}

function splitPathToKeys(path) {
  let ret
  if (path.indexOf('\\.') === -1) {
    ret = path.split('.')
  } else {
    ret = reserveString(path).split(/\.(?!\\)/).reverse()
    for (let i = 0, l = ret.length; i < l; i++) {
      ret[i] = reserveString(ret[i].replace(/\.\\/g, '.'))
    }
  }
  return ret
}

// 对`path`进行递归取值
export function getValueByPath(path, data, isKey) {
  isKey = isKey || false
  if (isKey === true || path.indexOf('.') === -1) {
    return data[path]
  }
  const keys = splitPathToKeys(path)

  while (keys.length) {
    const key = keys.shift()
    data = getValueByPath(key, data, true)

    if (typeof data !== 'object' || data === UNDEFINED) {
      if (keys.length) data = UNDEFINED
      break
    }
  }
  return data
}

export function isDef(v) {
  return v !== undefined && v !== null
}

/**
 * 生成唯一 ID, 理论上的唯一
 */
export function createUuid() {
  return `${(Math.random() * 10000000).toString(16).substr(0, 4)}-${(new Date()).getTime()}-${Math.random().toString().substr(2, 5)}`
}

/**
 * 金额数据格式化
 *
 * @param {number} d
 * @returns {(number | string)}
 * @memberof Base
 */
export function formatMoney(d) {
  if (d >= 1000 || d <= -1000) {
    return `${(d / 1000).toFixed(1)}k`
  }

  return d
}

export function getTextWidth(text, size) {
  ctx.font = `${size}px ${STYLE.FONT_FAMILY}`
  return ctx.measureText(text).width
}

export function getTextHeight(size) {
  return size * 1.4
}
