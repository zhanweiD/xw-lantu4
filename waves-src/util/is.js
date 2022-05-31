export function isNumber(v) {
  return !Number.isNaN(v) && typeof v === 'number'
}

export function isWindow(v) {
  return v !== null && v === v.window
}

export function isBoolean(v) {
  return typeof v === 'boolean'
}

export function isFunction(v) {
  return typeof v === 'function'
}

export function isDef(v) {
  return v !== undefined && v !== null
}

// 是个字符串
export function isString(v) {
  return Object.prototype.toString.call(v) === '[object String]'
}

// 是个对象
export function isObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]'
}

// 是个数组
export function isArray(v) {
  return Object.prototype.toString.call(v) === '[object Array]'
}
