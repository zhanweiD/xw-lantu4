import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Switch} from '@components/field/switch'
import fields from '@builders/fields'
import Section from '@builders/section'
import IconButton from '@components/icon-button'
import TabScroll from '@components/tab-scroll'
import {useTranslation} from 'react-i18next'

import s from './button.module.styl'

const {Item} = TabScroll

const {SelectField} = fields

const AddEventButton = ({onClick}) => {
  return (
    <div onClick={onClick} className={c('m8', s.addEvent)}>
      添加事件
    </div>
  )
}

const ActionsTab = observer(({actions, eventTypes, onRemoveAction, onAddAction, setCurrentAction, currentActionId}) => {
  const {t} = useTranslation()
  return (
    <div>
      <div className="fbh fbjsb mr8 ml24">
        <span>实现动作</span>
        <div className="fbh">
          <IconButton onClick={onAddAction} icon="add" buttonSize={24} iconSize={12} />
          <IconButton onClick={onRemoveAction} icon="remove" buttonSize={24} iconSize={12} />
        </div>
      </div>
      <div>
        <TabScroll headClassName="ml24 mr8 mb8" activeKey={currentActionId} onChange={(id) => setCurrentAction(id)}>
          {actions.map((action, index) => {
            const {actionId} = action
            return (
              <Item name={`动作${index + 1}`} key={actionId} itemKey={actionId}>
                <div>
                  <SelectField
                    label="触发动作"
                    options={eventTypes.map((d) => ({key: t(d), value: d}))} // 翻译下对应的类型
                    className="mr8 ml24"
                  />
                  <SelectField
                    label="目标对象"
                    options={eventTypes.map((d) => ({key: t(d), value: d}))} // 翻译下对应的类型
                    className="mr8 ml24"
                  />
                </div>
              </Item>
            )
          })}
        </TabScroll>
      </div>
    </div>
  )
})

const EventCard = observer(({eventInfo = {}, eventTypes = [], onRemoveEvent, index}) => {
  const {eventId, effective, actions, setEffective, addAction, removeAction, setCurrentAction, currentAction} =
    eventInfo
  const {t} = useTranslation()
  console.log('eventTypes...', eventTypes)
  return (
    <Section
      name={`事件${index + 1}`}
      extra={
        <div className="fbh fbac">
          <Switch
            className={c(s.eventSwitch, {switch_on: effective})}
            value={effective}
            onChange={(ck) => setEffective(ck)}
          />
          <IconButton onClick={() => onRemoveEvent(eventId)} key="remove" icon="remove" buttonSize={24} iconSize={12} />
        </div>
      }
    >
      <SelectField
        label="触发动作"
        options={eventTypes.map((d) => ({key: t(d), value: d}))} // 翻译下对应的类型
        className="mr8 ml24"
      />
      <ActionsTab
        setCurrentAction={setCurrentAction}
        onRemoveAction={(actionId) => removeAction(actionId)}
        onAddAction={() => addAction()}
        actions={actions}
        currentActionId={currentAction.actionId}
        eventTypes={eventTypes}
      />
    </Section>
  )
})

const ButtonInteraction = ({model}) => {
  console.log('model...', model)
  const {triggerTypes, eventModel} = model
  const {events = [], addEvent, removeEvent} = eventModel

  return (
    <div className="ss">
      {events.map((event, index) => {
        return (
          <EventCard
            index={index}
            onRemoveEvent={removeEvent}
            eventInfo={event}
            key={event.eventId}
            eventTypes={triggerTypes}
          />
        )
      })}
      <AddEventButton onClick={() => addEvent()} />
    </div>
  )
}

export default observer(ButtonInteraction)
