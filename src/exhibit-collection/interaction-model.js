import {getParent, types} from 'mobx-state-tree'
import uuid from '@common/uuid'
import commonAction from '@utils/common-action'

const MAction = types
  .model('MAction', {
    actionId: types.identifier,
    actionType: types.optional(types.string, ''),
    // 事件监听者，保存box或者frameId
    // listeners: types.optional(types.frozen(), []),
    // 跳转链接
    // herfValue: types.optional(types.string, ''),
    actionValue: types.frozen(),
  })
  .views((self) => ({
    get _triggerType() {
      return getParent(self, 2).triggerType
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
  })
  .actions(commonAction(['set']))
  .actions((self) => {
    const afterCreate = () => {
      if (self.actions && self.actions.length === 0) {
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

    return {
      afterCreate,
      addAction,
      removeAction,
    }
  })

const MButtonInteraction = types
  .model('MButtonAction', {
    // 事件列表
    events: types.optional(types.array(MEvent), []),
  })
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

    const handleEvents = () => {
      // button 组件的事件
      // const parent = getParent(self)
      // const {event} = parent.exhibitModel
    }

    const afterCreate = () => {
      handleEvents()
    }

    return {
      addEvent,
      removeEvent,
      afterCreate,
    }
  })

export default MButtonInteraction
