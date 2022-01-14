import {types} from 'mobx-state-tree'

export const MGroup = types
  .model('MGroup', {
    id: types.optional(types.string, ''),
    boxIds: types.optional(types.array(types.union(types.string, types.number)), []),
    name: types.optional(types.string, ''),
  })
  .views(() => ({
    // 计算 box 范围
    get groupRange() {
      return ''
    },
  }))
  .actions((self) => {
    const create = () => {
      // TODO
    }
    // 删除组
    const remove = () => {
      // TODO
    }
    // 调整 zIndex
    const setZIndex = () => {
      // self.boxIds.forEach(boxId=>{
      // const box = self.xxxx.getBoxById(boxId)
      //   box.setZIndex(z)
      // })
    }
    // 组移动，调整大小
    const layout = () => {}
    // 复制
    const copy = () => {}

    // 组的重命名
    const reName = (value) => {
      self.name = value
    }
    return {
      create,
      remove,
      setZIndex,
      layout,
      copy,
      reName,
    }
  })
