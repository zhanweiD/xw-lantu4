/**
 * 简单类型的key 用于如果有当前的key，那就去除，如果没有就添加进去
 * @param {Array} arr - 有迭代属性的对象
 * @param {String | number} key
 */
export default function toggleArrayKey(arr, key) {
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
