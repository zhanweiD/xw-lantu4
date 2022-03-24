import {types} from 'mobx-state-tree'
import isDef from '@utils/is-def'
import commonAction from '@utils/common-action'
import getObjectData from '@utils/get-object-data'
import {transform} from './exhibit-config'
import MButtonInteraction from './button-interaction-model'

const MSuperLinkInteraction = types.model('MSuperLinkAction', {
  //
  eventTypes: types.enumeration(['click', 'doubleClick']),
})

const createInteractionModel = (key, config) => {
  const {eventTriggerTypes} = config
  console.log('config...', config)
  const MModel = types
    .model(`M${key}.interaction`, {
      name: 'interaction',
      // 触发对象名称
      triggerName: types.optional(types.string, ''),
      // 目标对象
      targets: types.frozen(),
      // 事件模型数据
      // eventModel: types.frozen(),
      triggerTypes: types.array(types.string, []),
    })
    // .views(self => ({
    //   get
    // }))
    // .actions(commonAction(['set', 'getSchema', 'setSchema']))
    .actions((self) => {
      const afterCreate = () => {
        console.log('createInteractionModel...afterCreate')
        if (key === 'button') {
          self.eventModel = MButtonInteraction.create()
        }
        self.triggerTypes = eventTriggerTypes
      }

      // const toggleEffective = () => {
      //   self.effective = !self.effective
      // }
      // const getData = () => {
      //   let values = {}
      //   const {options, effective} = self.getSchema()
      //   if (isDef(effective)) {
      //     values.effective = effective
      //   }

      //   if (!isDef(effective) || effective) {
      //     values = {
      //       ...values,
      //       ...getObjectData(options),
      //     }
      //   }
      //   return values
      // }

      return {
        afterCreate,
        // toggleEffective,
        // getData,
      }
    })
  return MModel
}

export const createInteractionClass = (key, config) => {
  const MModel = createInteractionModel(key, config)
  return MModel.create()
}
