import React, {useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Switch} from '@components/field/switch'
import fields from '@builders/fields'
import Section from '@builders/section'
import IconButton from '@components/icon-button'
import TabScroll from '@components/tab-scroll'
import {useTranslation} from 'react-i18next'
import TargetSelect from './target-select'
import actions from './actions'

import s from './interaction.module.styl'

const {Item} = TabScroll

const {SelectField, TextField} = fields

// format [key] => [{key: key, value: key}] 用于下拉选项
const formatOptions = (keys = [], t) => {
  return keys.map((d) => ({key: t(d), value: d}))
}

const AddEventButton = ({onClick}) => {
  return (
    <div onClick={onClick} className={c('m8', s.addEvent)}>
      添加事件
    </div>
  )
}

const ActionSetting = observer(({model}) => {
  const {t} = useTranslation()
  const {listeners, actionType, set, herfValue, _triggerType} = model
  return (
    <div>
      <SelectField
        label="动作类型"
        options={formatOptions(actions[_triggerType], t)}
        className="mr8 ml24"
        value={actionType}
        onChange={(v) => set('actionType', v)}
      />
      {actionType === 'href' ? (
        <TextField label="链接" className="mr8 ml24" value={herfValue} onChange={(v) => set('herfValue', v)} />
      ) : (
        <TargetSelect value={listeners} defaultValue={listeners} onChange={(v) => set('listeners', v)} />
      )}
    </div>
  )
})

const ActionsTab = observer(({actions, onRemoveAction, onAddAction, onTabChange, activeKey}) => {
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
        <TabScroll headClassName="ml24 mr8 mb8" activeKey={activeKey} onChange={(id) => onTabChange(id)}>
          {actions.map((action, index) => {
            const {actionId} = action
            return (
              <Item name={`动作${index + 1}`} key={actionId} itemKey={actionId}>
                <ActionSetting model={action} />
              </Item>
            )
          })}
        </TabScroll>
      </div>
    </div>
  )
})

const EventCard = observer(({eventInfo = {}, onRemoveEvent, index, eventTypes = []}) => {
  const {eventId, effective, actions, addAction, removeAction, set, currentAction, triggerType} = eventInfo
  const {t} = useTranslation()
  return (
    <Section
      name={`事件${index + 1}`}
      extra={
        <div className="fbh fbac">
          <Switch
            className={c(s.eventSwitch, {switch_on: effective})}
            value={effective}
            onChange={(ck) => set('effective', ck)}
          />
          <IconButton onClick={() => onRemoveEvent(eventId)} key="remove" icon="remove" buttonSize={24} iconSize={12} />
        </div>
      }
    >
      <SelectField
        label="触发动作"
        options={formatOptions(eventTypes, t)} // 翻译下对应的类型
        className="mr8 ml24"
        value={triggerType}
        onChange={(v) => set('triggerType', v)}
      />
      <ActionsTab
        onTabChange={(id) => set('currentAction', id)}
        onRemoveAction={(actionId) => removeAction(actionId)}
        onAddAction={() => addAction()}
        actions={actions}
        activeKey={currentAction.actionId}
      />
    </Section>
  )
})

const Interaction = ({model}) => {
  const {triggerTypes, eventModel, exhibitId} = model
  const {events = [], addEvent, removeEvent} = eventModel

  return (
    <div className="ss">
      <AddEventButton onClick={() => addEvent()} />
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
    </div>
  )
}

export default observer(Interaction)
