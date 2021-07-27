import {Children, useState, useEffect} from "react"

/**
 * 查询数组中是否有当前的key，根据flag，是添加还是删除
 * @param {String or Number} key
 * @param {Array} arr 数组数据
 * @param {Boolean} flag 是否删除
 */
export function arrCheck(key, flag, arr = []) {
  const index = arr.indexOf(key)
  if (flag && index < 0) {
    arr.push(key)
  } else if (!flag && index > -1) {
    arr.splice(index, 1)
  }
  return arr
}

/**
 *
 * @param {Array} children 将react props.children变成数组
 */
export function toArray(children) {
  const ret = []
  Children.forEach(children, (c) => ret.push(c))
  return ret
}

// 遍历所有的子节点
export function traverseTreeNodes(treeNodes, callback) {
  function processNode(node, index, parent) {
    const children = node ? node.props.children : treeNodes
    // 过滤children
    const childList = toArray(children)
    if (node) {
      callback({
        node,
        index,
        currentKey: node.props.itemKey,
        // TODO 过滤搜索
        // currentTitle: node.props.title,
        // parentTitle: parent ? parent.props.title : null,
        parentKey: parent ? parent.props.itemKey : null
      })
    }
    Children.forEach(childList, (subNode, subIndex) => {
      processNode(subNode, subIndex, node)
    })
  }
  processNode(null)
}

export const noop = () => undefined

/**
 * 简单类型的key 用于如果有当前的key，那就去除，如果没有就添加进去
 * @param {Array} arr - 有迭代属性的对象
 * @param {String | number} key
 */
export function toggleArrayKey(arr, key) {
  let set = new Set(arr)
  if (set.has(key)) {
    set.delete(key)
  } else {
    set.add(key)
  }
  arr = Array.from(set)
  set = null
  return arr
}

export function caculateBadgeValue(value) {
  value = +value
  if (Number.isNaN(value)) console.warn("badge value must bu a number !")
  if (value > 99) {
    return "99+"
  }
  return value
}

/**
 * 利用hooks 实现的debounce
 * @param {any} value 要改变的值
 * @param {number} delay 延迟的时间戳
 * @return 返回延迟后set进去的值
 */
export function useDebounce(value, delay) {
  const [val, setVal] = useState(value)

  useEffect(() => {
    // 没有值的时候直接响应
    // if (!value) {
    //   setVal(value)
    // }
    const timer = setTimeout(() => setVal(value), delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return val
}
