import React, {useEffect, useMemo, useState} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {Switch} from '@components/field/switch'
import fields from '@builders/fields'
import Section from '@builders/section'
import IconButton from '@components/icon-button'
import TabScroll from '@components/tab-scroll'
import {useTranslation} from 'react-i18next'
import actions from '@exhibit-collection/actions'
import InteractionField from '../inertaction-field'

import s from './interaction.module.styl'

import './interaction.styl'

const {Item} = TabScroll

const {SelectField} = fields

// format [key] => [{key: key, value: key}] 用于下拉选项
const formatOptions = (keys = [], t) => {
  return keys.map((d) => ({key: t(d), value: d}))
}

const AddEventButton = ({onClick}) => {
  return (
    <div onClick={onClick} className={c('m8 hand', s.addEvent)}>
      添加事件
    </div>
  )
}

const ActionSetting = observer(({model}) => {
  const {t} = useTranslation()
  const {actionType, set, _triggerType, actionValue} = model
  // 缓存value值，因为组件非受控，只用传一次就够了
  const actionValueMemo = useMemo(() => actionValue, [])
  return (
    <div>
      <SelectField
        label="动作类型"
        options={formatOptions(actions[_triggerType], t)}
        className="mr8 ml24"
        value={actionType}
        onChange={(v) => set('actionType', v)}
      />
      <InteractionField type={actionType} defaultValue={actionValueMemo} onChange={(v) => set('actionValue', v)} />
    </div>
  )
})

const ActionsTab = observer((props) => {
  const {disabledAddAndRemove, actions, onRemoveAction, onAddAction, onTabChange, activeKey} = props
  const {t} = useTranslation()
  return (
    <div>
      <div className="fbh fbac fbjsb mr8 ml24 mb8">
        <span>实现动作</span>
        {disabledAddAndRemove ? (
          <div />
        ) : (
          <div className="fbh">
            <IconButton onClick={onAddAction} icon="add" buttonSize={24} iconSize={12} />
            <IconButton onClick={onRemoveAction} icon="remove" buttonSize={24} iconSize={12} />
          </div>
        )}
      </div>
      <div>
        <TabScroll headClassName="ml24 mr8 mb8" activeKey={activeKey} onChange={(id) => onTabChange(id)}>
          {actions.map((action, index) => {
            const {actionId, actionName} = action
            return (
              <Item name={actionName || `动作${index + 1}`} key={actionId} itemKey={actionId}>
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
  const {isCanAddAndRemove, eventId, effective, actions, addAction, removeAction, set, currentAction, triggerType} =
    eventInfo
  const {t} = useTranslation()
  return (
    <Section
      name={`事件${index + 1}`}
      extra={
        <div className="fbh fbac">
          <Switch
            className={c('eventSwitch', {switch_on: effective})}
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
        disabledAddAndRemove={!isCanAddAndRemove}
      />
    </Section>
  )
})

const Interaction = ({model}) => {
  const {triggerTypes, eventModel, exhibitId} = model
  const {events = [], addEvent, removeEvent} = eventModel

  return (
    <div>
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
