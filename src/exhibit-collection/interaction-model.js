import {getParent, types} from 'mobx-state-tree'
import uuid from '@common/uuid'
import commonAction from '@utils/common-action'

// const MActionValue = types.model({})
//   .volatile(self => ({
//     state: {}
//   })).actions(self => ({
//     setState(v) {
//       self.state = v
//     }
//   }))

const MAction = types
  .model('MAction', {
    actionId: types.identifier,
    actionType: types.optional(types.string, ''),
    // 事件监听者，保存box或者frameId
    // listeners: types.optional(types.frozen(), []),
    // 跳转链接
    actionName: types.optional(types.string, ''),
    actionValue: types.optional(types.frozen(), {}),
  })
  .views((self) => ({
    get _triggerType() {
      return getParent(self, 2).triggerType
    },
    get dataFieldList() {
      return getParent(self, 4).dataFieldList
    },
    get exhibitKey() {
      return getParent(self, 5).exhibitModel.key
    },
  }))
  .actions(commonAction(['set']))

const MEvent = types
  .model('MEvent', {
    eventId: types.identifier,
    effective: types.optional(types.boolean, true),
    actions: types.array(MAction),
    currentAction: types.optional(types.reference(MAction), ''),
    triggerType: types.optional(types.string, ''),
    normalKeys: types.frozen(['eventId', 'effective', 'actions', 'triggerType']),
  })
  .views((self) => ({
    get isCanAddAndRemove() {
      return true
    },
  }))
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (!self.actions.length) {
        self.addAction()
      }
    }

    const addAction = () => {
      const id = uuid()
      self.actions.push({
        actionId: id,
      })
      self.currentAction = id
    }

    const removeAction = () => {
      if (self.actions.length > 1) {
        self.actions = self.actions.filter((d) => d.actionId !== self.currentAction.actionId)
        self.currentAction = self.actions[0].actionId
      }
    }

    const beforeDestroy = () => {}

    return {
      afterCreate,
      addAction,
      removeAction,
      beforeDestroy,
    }
  })

const MInteraction = types
  .model('MInteraction', {
    // 事件列表
    events: types.optional(types.array(MEvent), []),
  })
  .views((self) => ({
    get dataFieldList() {
      return getParent(self, 1).fieldList
    },
  }))
  .actions((self) => {
    const addEvent = () => {
      const id = uuid()
      self.events.push({
        eventId: id,
      })
    }
    const removeEvent = (eventId) => {
      self.events = self.events.filter((d) => d.eventId !== eventId)
    }

    const afterCreate = () => {}

    return {
      addEvent,
      removeEvent,
      afterCreate,
    }
  })

export default MInteraction
