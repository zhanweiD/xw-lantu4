import * as d3 from 'd3'
// import {isFunction, isNumber} from './is'
// import {EMPTY, UNDEFINED} from './constant'
// import {STYLE} from '../common/static'

// 利用canvas计算文本宽度
const ctx = document.createElement('canvas').getContext('2d')

// const colorTool = require('color')

// // 颜色变亮
// export function lighten(color, luminance = 0.15) {
//   return colorTool(color).lighten(luminance).hex()
// }

// // 颜色变暗
// export function darken(color, luminance = 0.15) {
//   return colorTool(color).darken(luminance).hex()
// }

// export function transformer(x, y) {
//   return `translate(${x}, ${y})`
// }

// export function newTransformer(x, y) {
//   return {
//     transform: `translate(${x}, ${y})`,
//   }
// }

// // 查找一个数值在某个数组之间的索引(如果arr中没有等于key的数值那么返回小于key的第一个数值的索引)
// export function binarySearch(arr, key) {
//   let low = 0
//   let high = arr.length - 1
//   while (low <= high) {
//     const mid = parseInt(`${(high + low) / 2}`, 0)
//     if (key === arr[mid]) {
//       return mid
//     } else if (key > arr[mid]) {
//       low = mid + 1
//       if (key < arr[mid + 1]) return mid
//     } else if (key < arr[mid]) {
//       high = mid - 1
//       if (key > arr[mid - 1]) return mid - 1
//     } else {
//       return -1
//     }
//   }
// }

/**
 * 获取
 * @param {array} text 文本数组
 * @param {number} size 字号(经过this.font计算过的)
 */
export function getTextMaxLength(texts, size) {
  let length = 0
  for (let i = 0, l = texts.length; i < l; i++) {
    length = Math.max(length, getTextWidth(texts[i], size))
  }
  return length
}

/**
 * 获取一个节点的父节点数据
 * @param {HTMLElement} elm 当前节点
 * @param {number} n 向上获取几层？
 */
export function parentData(elm, n = 1) {
  if (!elm) return {data: null, index: null}
  const i = n - 1
  return i ? parentData(elm.parentNode, i) : {
    data: elm.parentNode ? elm.parentNode.__data__ : null,
    index: elm.parentNode ? elm.parentNode.__index__ : null,
  }
}

/**
   * 获取文字宽度
   *
   * @param {string} text
   * @param {number} size
   * @returns {number}
   * @memberof Base
   */

const STYLE = {
  FONT_FAMILY: "'PingFang SC', 'Helvetica Neue', Helvetica, Tahoma, Helvetica, sans-serif",
}
export function getTextWidth(text, size) {
  ctx.font = `${size}px ${STYLE.FONT_FAMILY}`
  return ctx.measureText(text).width
}

export function getTextHeight(size) {
  return size * 1.4
}

// export function getTranslate(transform: string) {
//   let data = transform.replace('translate(', '')
//   data = data.replace(' ', '')
//   data = data.replace(')', '')

//   return [+data.split(',')[0], +data.split(',')[1]]
// }

// 有没有因为要给path线条做stroke-dasharray射线动画时却不知道path的总长度而烦恼 没错！！这个方法就是解决总长度的问题
// 获取path线条的总长度
export function getTotalLength(elm) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', typeof elm === 'string' ? elm : elm.getAttribute('d'))
  return path.getTotalLength()
}

// // 设置 translate 的数值
// export function setTranslate(translateX: string | number, translateY: string | number) {
//   return `translate(${translateX}, ${translateY})`
// }

// export function randoms(base, max, l) {
//   const arr = []
//   for (let i = 0; i < l; i += 1) {
//     const num = Math.ceil(Math.random() * (max - base))
//     arr.push(num + base)
//   }
//   return l <= 1 ? arr[0] : arr
// }

export function kebabCase(string) {
  if (typeof string !== 'string') {
    return string
  }
  return string.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-')
}

// export function getSelect(source) {
//   return Object.keys(source).map(k => {
//     return {
//       key: source[k].key,
//       value: source[k].value,
//     }
//   })
// }

// 十六进制颜色转rgba
// export function hexToRgb(hex, opacity) { 
//   try {
//     const obj = colorTool(hex).fade(1 - opacity).object()
//     return `rgba(${obj.r},${obj.g},${obj.b},${obj.alpha})`
//   } catch (err) {
//     console.log(`hex 不是有效颜色: ${hex}`)
//     return hex
//   }
// }

// /**
//  * 
//  * @param ele 元素
//  * @param styleObj 样式object
//  * @param action 调用selection.style 还是selection.attr 方法
//  * @example d3.select(g).call(setStyleMap, {fontSize: 20}, 'attr')
//  */
export function setStyleMap(ele, styleObj, action = 'style') {
  Object.keys(styleObj).forEach(key => {
    ele[action](kebabCase(key), styleObj[key])
  })
}

// export function font(n: number, artboardHeight: number): number {
//   return (artboardHeight / 105) * (n / 10)
// }

// export function runAsFn(v, t) {
//   return isFunction(v) ? v.call(t) : v
// }

// export function error(meg) {
//   console.error(`Waves Error: ${meg}`)
// }

// // 展开 padding 的值
// export function extendPadding(padding): number[] {
//   let newPadding = padding

//   // 如果是纯数字，转为数组
//   if (isNumber(newPadding)) {
//     newPadding = [].concat(newPadding)
//   }

//   // 验证每个值是否的纯数字
//   for (let i = 0, l = newPadding.length; i < l; i += 1) {
//     if (!isNumber(newPadding[i])) {
//       throw new Error('Padding Values Must Be Number')
//     }
//   }

//   // 展开为[a,b,c,d]形式
//   if (newPadding.length === 1) {
//     newPadding = [newPadding[0], newPadding[0], newPadding[0], newPadding[0]]
//   } else if (newPadding.length === 2) {
//     newPadding = [newPadding[0], newPadding[1], newPadding[0], newPadding[1]]
//   } else if (newPadding.length === 3) {
//     newPadding = [newPadding[0], newPadding[1], newPadding[2], newPadding[1]]
//   }

//   return newPadding
// }


// 根据一组颜色生成一个颜色列表
export function generateColorList(color, n = 255) {
  const colors = []
  const l = color.length
  if (color.length === 1) {
    for (let i = 0; i < n; i += 1) {
      colors.push(color[0])
    }
  } else {
    for (let a = 0, b = 1; b < l; a += 1, b += 1) {
      const compute = d3.interpolate(color[a], color[b])
      for (let i = 0; i < n; i += 1) {
        // colors.push(colorTool(compute(i / n)).hex())
        colors.push(compute(i / n))
      }
    }
  }
  colors.push(color.slice(-1)[0])
  return colors
}

// function reserveString(str) {
//   return str.split(EMPTY).reverse().join(EMPTY)
// }

// function splitPathToKeys(path) {
//   let ret
//   if (path.indexOf('\\.') === -1) {
//     ret = path.split('.')
//   } else {
//     ret = reserveString(path).split(/\.(?!\\)/).reverse()
//     for (let i = 0, l = ret.length; i < l; i += 1) {
//       ret[i] = reserveString(ret[i].replace(/\.\\/g, '.'))
//     }
//   }
//   return ret
// }

// // 对`path`进行递归取值
// export function getValueByPath(path: string, data: object, isKey?: boolean) {
//   const iskey = isKey || false
//   if (iskey === true || path.indexOf('.') === -1) {
//     return data[path]
//   }
//   const keys = splitPathToKeys(path)
//   let result

//   while (keys.length) {
//     const key = keys.shift()
//     result = getValueByPath(key, data, true)

//     if (typeof result !== 'object' || result === UNDEFINED) {
//       if (keys.length) {
//         result = UNDEFINED
//       }
//       break
//     }
//   }
//   return result
// }

// export function config(constructor) {
//   // eslint-disable-next-line no-param-reassign
//   constructor.prototype.config = function (path: string): any {
//     const v = getValueByPath(path, this.option)
//     return v !== UNDEFINED ? v : getValueByPath(path, this.baseOption)
//   }
// }

// // 随机字符串字符集
// const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'

// // 创建随机字符串
// export function makeRandom(n = 6) {
//   let str = ''
//   for (let i = 0; i < n; i += 1) {
//     str += chars.charAt(Math.floor(Math.random() * chars.length))
//   }
//   return str
// }

// // 终端是Mac
// export function isMac() {
//   const sUserAgent = navigator.userAgent
//   return (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
// }

// // 终端是window
export function isWindows() {
  // const sUserAgent = navigator.userAgent
  return (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
}

// // 判断浏览器支持哪种TransitionEvent
// export function whichTransitionEvent() {
//   const el = document.createElement('fakeelement')
//   const transitions = {
//     'transition': 'transitionend',
//     'OTransition': 'oTransitionEnd',
//     'MozTransition': 'transitionend',
//     'WebkitTransition': 'webkitTransitionEnd',
//   }
//   for (const t in transitions) {
//     if (el.style[t] !== undefined) {
//       return transitions[t]
//     }
//   }
// }


// /**
//  * 校验datas的长度是否满足图表的要求
//  *
//  * @param {*} datas
//  * @param {number} requiredLength
//  * @returns {boolean}
//  * @memberof Base
//  */
// export function validateValuesLength(datas: any, requiredLength: number): boolean {
//   if (datas.length < requiredLength) {
//     return false
//   }
//   return true
// }

// /**
//  * 校验labels和datas的长度是否一致
//  *
//  * @param {*} datas
//  * @returns {boolean}
//  * @memberof Base
//  */
// export function validateLabelsAndDatasLength(datas: any): boolean {
//   const arr = []
//   arr.push(datas.labels.length)
//   datas.values.forEach(item => {
//     arr.push(item.datas.length)
//   })

//   const isAllEqual = arr.every((item, index, arrs) => item === arrs[0])

//   return isAllEqual
// }

/**
 * 生成唯一 ID, 理论上的唯一
 */
export function createUuid() {
  return `${(Math.random() * 10000000).toString(16).substr(0, 4)}-${(new Date()).getTime()}-${Math.random().toString().substr(2, 5)}`
}
