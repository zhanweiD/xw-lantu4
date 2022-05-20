import {types} from 'mobx-state-tree'
import MInteraction from './interaction-model'

const createInteractionModel = (key, exhibit, parentModel) => {
  // event 包含了art， event，data， event 在root创建传入的env event
  // this event是全局的， 交互的实现通过这个
  const {config} = exhibit
  const {eventTriggerTypes, needConditions} = config.interaction
  console.log('config...', key, exhibit, parentModel)
  const MModel = types
    .model(`M${key}.interaction`, {
      name: 'interaction',
      // 触发组件类型
      triggerKey: key,
      // 触发对象名称
      triggerName: types.optional(types.string, ''),
      // 目标对象
      targets: types.frozen(),
      // 以图表id为准，因为box内容可换
      trigger: types.optional(types.string, ''),
      // 事件模型数据 不同组件不同模型
      eventModel: types.optional(MInteraction, {}),
      // 事件触发者组件的model 在view层挂载
      // exhibitModel: types.maybeNull(),
      triggerTypes: types.array(types.string, []),
      // 组件id
      exhibitId: types.optional(types.string, parentModel.id),
    })
    .views((self) => ({
      get fieldList() {
        return self.exhibitModel?.data?.value?.columns.toJSON()
      },
    }))
    .actions((self) => {
      const afterCreate = () => {
        // 支持的事件类型
        self.exhibitModel = parentModel
        self.triggerTypes = eventTriggerTypes
      }

      const getSchema = () => {
        return self.eventModel.toJSON()
      }

      const setSchema = (schema) => {
        self.eventModel = schema
        // 分开发环境只在加载完数据，进行事件绑定,只绑定一次,
        // parentModel.registerEvent(schema)
      }
      return {
        afterCreate,
        getSchema,
        setSchema,
      }
    })
  return MModel
}

export const createInteractionClass = (key, exhibit, parentEnv) => {
  const MModel = createInteractionModel(key, exhibit, parentEnv)
  return MModel.create()
}
