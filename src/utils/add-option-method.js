import isPlainObject from 'lodash/isPlainObject'
import onerStorage from 'oner-storage'
import isDef from '@utils/is-def'
import random from '@utils/random'

// 在带有options属性的对象上, 添加getOption和mapOption方法
export default (o) => {
  if (isPlainObject(o)) {
    if (!isDef(o.options)) {
      o.options = Object.assign({}, o)
    }
    // storage化的options数据
    const storageOptions = onerStorage({
      type: 'variable',
      key: `v-${random()}`, // !!! 唯一必选的参数, 用于内部存储 !!!
    })

    storageOptions.data(o.options)

    // 根据路径取得参数的便捷方式
    o.getOption = (path, fallback) => {
      return storageOptions.get(path, fallback)
    }

    // 实验性开放
    // list = [
    //   ['inner/path', 'my/path', {innerValue1: 'myValue1', innerValue2: 'myValue2'}],
    //   ['inner/path', 'my/path', {innerValue: 'myValue'}],
    // ]
    o.mapOption = (list) => {
      // console.info('!!! 收集什么时候使用这个方法？`getOption()`就应该可以满足 !!!')
      const newStorageOptions = onerStorage({
        type: 'variable',
        key: `v-${random()}`, // !!! 唯一必选的参数, 用于内部存储 !!!
      })
      newStorageOptions.data({})

      if (Array.isArray(list)) {
        list.forEach((item) => {
          const [oldPath, newPath, valueMap] = item
          newStorageOptions.set(
            newPath,
            isPlainObject(valueMap) && isDef(valueMap[storageOptions.get(oldPath)])
              ? valueMap[storageOptions.get(oldPath)]
              : storageOptions.get(oldPath)
          )
        })
      }
      return newStorageOptions
    }
  }
  return o
}
