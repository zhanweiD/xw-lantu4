import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {Field} from '@builders/fields/base'
import c from 'classnames'
import TreeSelect from '@components/tree-select'
import Scroll from '@components/scroll'
import w from '@models'
import uuid from '@common/uuid'
import {SelectField, TextField, Radio} from '@components/field'
import IconButton from '@components/icon-button'
import {CONDITIONS} from '@common/const'

import s from './interaction.module.styl'

const conditions = CONDITIONS.map((d) => ({value: d, key: d}))

function toggleOutlineById(id, flag) {
  let boxDom = document.getElementById(`box-${id}`)
  if (boxDom && boxDom.style) {
    boxDom.style.outline = flag ? '#07f solid 2px' : ''
    boxDom = null
  }
}

const MyField = ({label, children, className}) => {
  return (
    <Field label={label} childrenClassName={className} className={c('mr8 ml24', s.baseLine)}>
      {children}
    </Field>
  )
}

const TargetSelect = ({onChange, defaultValue}) => {
  const {art} = w.editor.getCurrentTab()
  const actionTargets = art?.viewport?.getAllBoxs()
  const onEnterTarget = useCallback((node) => {
    toggleOutlineById(node.key, true)
  }, [])
  const {targets = []} = defaultValue
  return (
    <MyField label="目标对象" className={c(s.lineHeight_initial)}>
      <Scroll className="w100p">
        <TreeSelect
          defaultValue={targets}
          onChange={(v) => onChange({targets: v})}
          options={actionTargets}
          onNodeLeave={(node) => {
            toggleOutlineById(node.key, false)
          }}
          onNodeEnter={onEnterTarget}
        />
      </Scroll>
    </MyField>
  )
}
/**
 *
 * condition 输出的格式是 object
 * fieldName 字段名
 * operator 操作符
 * fieldValue 字段值
 */
const ConditionItem = ({onRemove, data = {}, dataFieldList = [], onChange}) => {
  const setData = (key, value) => {
    data[key] = value
    onChange && onChange()
  }
  return (
    <div className={c('fbh fbac mb8 fbjsb')}>
      <div className="mr8 fb1">
        <SelectField
          defaultValue={data?.fieldName}
          options={dataFieldList.map((d) => ({key: d.column, value: d.column}))}
          onChange={(v) => setData('fieldName', v)}
          noField
          placeholder="字段名"
        />
      </div>
      <div className={c('mr8', s.conditionField)}>
        <SelectField
          onChange={(v) => setData('operator', v)}
          noField
          defaultValue={data.operator}
          options={conditions}
        />
      </div>
      <div className="fb1">
        <TextField
          defaultValue={data?.fieldValue}
          onChange={(v) => setData('fieldValue', v)}
          noField
          placeholder="字段值"
        />
      </div>
      <IconButton onClick={onRemove} icon="remove" buttonSize={24} iconSize={12} />
    </div>
  )
}

const Condition = ({onChange, defaultValue = {}, dataFieldList}) => {
  const [conditions, setConditions] = useState(defaultValue.conditions || [])
  const [triggerCondition, setCv] = useState(defaultValue.triggerCondition || 'every')
  const addCondition = () => {
    setConditions([...conditions, {id: uuid(), operator: '='}])
  }
  const onRemove = (id) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }
  useEffect(() => {
    onChange &&
      onChange({
        conditions,
        triggerCondition,
      })
  }, [conditions, triggerCondition])
  return (
    <MyField label="触发条件">
      <div className="w100p">
        <div>
          {conditions.map((cd) => (
            <ConditionItem
              onChange={() => onChange && onChange({conditions, triggerCondition})}
              dataFieldList={dataFieldList}
              data={cd}
              onRemove={() => onRemove(cd.id)}
              key={cd.id}
            />
          ))}
        </div>
        {conditions.length >= 2 && (
          <Radio.Group className="mb8" onChange={(v) => setCv(v)} value={triggerCondition}>
            <Radio className="mr16" value="every">
              满足所以条件
            </Radio>
            <Radio value="some">满足任意条件</Radio>
          </Radio.Group>
        )}
        <div onClick={addCondition} className={c(s.addConditionBtn)}>
          添加条件
        </div>
      </div>
    </MyField>
  )
}

export const ConditionTargetSelect = ({dataFieldList, onChange, defaultValue = {}, exhibitKey}) => {
  const cacheValue = useRef(defaultValue)
  const onVChange = useCallback((v) => {
    const value = {...cacheValue.current, ...v}
    onChange(value)
    cacheValue.current = value
  }, [])
  return (
    <>
      {
        // button 不需要条件，特殊处理
        exhibitKey !== 'button' && (
          <Condition onChange={onVChange} dataFieldList={dataFieldList} defaultValue={defaultValue} />
        )
      }
      <TargetSelect onChange={(v) => onVChange(v)} defaultValue={defaultValue} />
    </>
  )
}

export default TargetSelect
