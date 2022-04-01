import React from 'react'
import {Field} from '@builders/fields/base'
import TreeSelect from '@components/tree-select'
import {observer} from 'mobx-react-lite'

import s from './interaction.module.styl'

const {TextField} = fields

const actionFieldMap = {
  // 链接跳转
  herf: ({herf}) => <TextField value={herf} {...props} />,
  // 选择对象
  targetSelect: (props) => (
    <Field childrenClassName={c(s.lineHeight_initial)} className={c('mr8 ml24', s.baseLine)} label="目标对象">
      <Scroll>
        <TreeSelect {...props} />
      </Scroll>
    </Field>
  ),
}

const FieldCreater = observer(({type, fieldProps}) => {
  if (['show', 'hidden', 'toggle_visible']) {
    type = 'targetSelect'
  }
  const ActionFieldComponent = actionFieldMap[type]
  return <ActionFieldComponent {...fieldProps} />
})

export default FieldCreater
