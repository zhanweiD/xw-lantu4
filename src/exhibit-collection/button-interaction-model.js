import {types} from 'mobx-state-tree'
// import commonAction from '@utils/common-action'
import uuid from '@common/uuid'

const MAction = types.model('MAction', {
  actionId: types.identifier,
  actionType: types.optional(types.string, ''),
  // 事件监听者，保存box或者frameId
  listeners: types.optional(types.frozen([]), []),
})

const MEvent = types
  .model('MEvent', {
    eventId: types.identifier,
    effective: types.optional(types.boolean, true),
    actions: types.array(MAction),
    currentAction: types.optional(types.reference(MAction), ''),
  })
  .actions((self) => {
    const afterCreate = () => {
      self.addAction()
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

    const setCurrentAction = (id) => {
      self.currentAction = id
    }

    const setEffective = (effective) => {
      self.effective = effective
    }
    return {
      afterCreate,
      addAction,
      removeAction,
      setEffective,
      setCurrentAction,
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
    return {
      addEvent,
      removeEvent,
    }
  })

export default MButtonInteraction
