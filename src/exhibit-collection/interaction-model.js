import {getParent, types} from 'mobx-state-tree'
import uuid from '@common/uuid'
import commonAction from '@utils/common-action'
import {reaction} from 'mobx'

// 定制化处理tab switch事件
function handleTabEvent(actions = [], dataSource = []) {
  // 数据无变化, 不做处理
  if (actions.length === dataSource.length) return actions
  // 数据变更，响应的在初始化的时候，要同步数据创建对应的动作
  // tab的动作和tab的数据是按索引对应的
  return dataSource.map((d, index) => {
    const actionName = d[0]
    if (actions[index]) {
      return {
        actionName,
        ...actions[index],
      }
    }
    return {
      actionName,
      // actionType: 'show',
      actionId: uuid(),
    }
  })
}

const MAction = types
  .model('MAction', {
    actionId: types.identifier,
    actionType: types.optional(types.string, ''),
    // 事件监听者，保存box或者frameId
    // listeners: types.optional(types.frozen(), []),
    // 跳转链接
    actionName: types.optional(types.string, ''),
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
    normalKeys: types.frozen(['eventId', 'effective', 'actions', 'triggerType']),
    // 不需要保存到后端
    isCanAddAndRemove: types.optional(types.boolean, true),
  })
  .actions(commonAction(['set']))
  .actions((self) => {
    const handleTabSwitch = () => {
      self.isCanAddAndRemove = false
      const interactionModel = getParent(self, 3)
      const data = interactionModel.exhibitModel.getData()
      self.actions = handleTabEvent(self.actions.toJSON(), data.slice(1))
      if (self.actions.length > 0) {
        self.currentAction = self.actions[0]['actionId']
      }
    }
    let reactionDisposer
    const afterCreate = () => {
      const interactionModel = getParent(self, 3)
      const {triggerKey} = interactionModel
      if (triggerKey === 'uiTabButton') {
        // tab 组件，因为要自动同步数据, 定制化处理
        const interactionModel = getParent(self, 3)
        reactionDisposer = reaction(
          () => interactionModel.exhibitModel.data.value.toJSON(),
          () => {
            const data = interactionModel.exhibitModel.getData() || []
            const realData = data.slice(1)
            if (realData.length !== self.actions.length) {
              console.log('reactionTabData: ', data)
              self.handleTabSwitch()
            }
          },
          {
            fireImmediately: true,
            delay: 30,
          }
        )
      } else if (self.actions && self.actions.length === 0) {
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

    const beforeDestroy = () => {
      reactionDisposer && reactionDisposer()
    }

    return {
      handleTabSwitch,
      afterCreate,
      addAction,
      removeAction,
      beforeDestroy,
    }
  })

const MInteraction = types
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

    const afterCreate = () => {
      // console.log('afterCreate...', getParent(self, 1))
    }

    return {
      addEvent,
      removeEvent,
      afterCreate,
    }
  })

export default MInteraction
