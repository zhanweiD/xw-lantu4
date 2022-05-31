/*
 * @file mock普通（对象数组类）的数据
 */
import {isObject, randoms} from './index'

const labels = (() => {
  const str = []
  for (let i = 65; i < 91; i++) {
    str.push(String.fromCharCode(i))
  }
  return str
})()

/**
 * 生成数值为随机类型的数据
 * @param {string []}           labelKeys  有哪些标签键
 * @param {string []}           valueKeys  有哪些数值键
 * @param {number}              num   生产多少条
 */
export default function dataMock(labelKeys?: any, valueKeys?: any, num = 12) {
  // 处理label
  labelKeys = labelKeys.map((label: any) => {
    const item = isObject(label) ? label : {}
    item.name = item.name || label
    item.num = item.num || num
    if (item.label) {
      item.labels = new Array(item.num).fill('').map((v, i) => `${item.label}-${i}`)
    } else {
      item.labels = item.num > labels.length ? new Array(item.num).fill('').map((v, i) => `A-${i}`) : labels.slice(0, item.num)
    }
    return item
  })

  // 处理数值
  valueKeys = valueKeys.map(k => {
    const valueItem = isObject(k) ? k : {
      name: k,
      range: [10, 100],
    }
    valueItem.value = valueItem.value || valueItem.range[0]
    return valueItem
  })

  return new Array(num).fill('').map((v, n) => {
    const item = {}

    // 添加label
    labelKeys.forEach((label, i) => {
      // 随机label
      if (label.isRandom) {
        item[label.name] = label.labels[Math.floor(Math.random() * label.num)]
      } else {
        item[label.name] = label.labels[n % label.num]
      }
    })

    // 添加数值
    valueKeys.forEach((value, i) => {
      if (value.progressive) {
        item[value.name] = value.value
        value.value += value.range[1]
      } else {
        item[value.name] = randoms(value.range[0], value.range[1], 1)
      }
    })
    return item
  })
}

/** 示例
dataMock(['label'], ['value'])

dataMock([{
  name: 'label',
  num: 12,
  isRandom: false,
}], [{
  name: 'value',
  range: [10, 100],
  value: 10,
  progressive: false,
}])

dataMock([{
  name: 'label',
  label: 'A',
  num: 12,
  isRandom: false,
}], [{
  name: 'value',
  range: [10, 100],
  value: 10,
  progressive: false,
}])
*/
