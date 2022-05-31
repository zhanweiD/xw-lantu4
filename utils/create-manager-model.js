import {types, getPropertyMembers} from 'mobx-state-tree'
import commonAction, {setModelSchema} from '@utils/common-action'
import uuid from '@utils/uuid'
import isDef from '@utils/is-def'

// NOTE 对于MItemModel的约定
// * 必须有id
// * 定义了ctime属性，才会有self.revertList排序数组可用
// * 应该有isNew属性，待落地规范
// NOTE 经验，为什么不直接使用map对象？
// * 因为调用的时候提示必须使用action
// * box2.create({id: xxx, name: xxx}) vs box2.set(id, {id: xxx, name: xxx}), id需要提取出来
export const createManagerModel = (name, MItemModel) => {
  let MManager = types
    .model(name, {
      // 存放成员列表
      map: types.optional(types.map(MItemModel), {}),
      deepKeys: types.frozen(['map']),
    })
    .views((self) => ({
      get list_() {
        return [...self.map]
      },
    }))
    .actions(commonAction(['getSchema', 'dumpSchema']))
    .actions((self) => {
      // NOTE 如果props不包含id，则使用内置的uuid生成id
      // NOTE props也可以传入其他希望有初始值的属性即可
      // NOTE ctime，isNew是内置处理
      const create = (props) => {
        const id = props && props.id ? props.id : uuid()
        self.map.set(id, {
          id,
          ctime: Date.now(),
          // NOTE isNew应该落地为全局新增成员的标准属性
          isNew: true,
          ...props,
        })

        // create之后经常直接要用到实例
        return self.map.get(id)
        // if (!value) {
        //   throw new Error(`${name}模型的create方法必选传入成员模型`)
        // }
        // if (!self.map.has(value.id)) {
        // } else {
        //   console.warn(`在${name}模型上添加了重复id(${value.id})的成员`)
        // }
      }

      // NOTE 根据id删除 或 根据成员删除(在jsx里可以省去 `.id`) 都支持
      const remove = (itemOrId) => {
        self.map.delete(`${itemOrId}`)
      }

      const get = (id) => {
        return self.map.get(id)
      }

      const setSchema = (schema) => {
        if (schema && schema.map) {
          Object.entries(schema.map).forEach(([id, itemSchema]) => {
            // const itemModel = MItemModel.create({id: itemSchema.id})
            // console.warn(id, itemSchema)
            self.map.set(id, {id: itemSchema.id})
            setModelSchema(self.map.get(id), itemSchema)
          })
        }
      }

      return {
        create,
        remove,
        get,
        setSchema,
      }
    })

  const {properties} = getPropertyMembers(MItemModel)
  if (isDef(properties.ctime)) {
    MManager = MManager.views((self) => ({
      get revertList() {
        return self.list_.sort((r1, r2) => r2[1].ctime - r1[1].ctime)
      },
    }))
    // log.warn(`'ctime' is not defined for param MItemModel(${modelName}) when calling 'createManagerModel(name, MItemModel)', so it will work nothing when use 'revertList'`)
  }

  return MManager
}
