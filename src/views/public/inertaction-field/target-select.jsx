import React from 'react'
import {Field} from '@builders/fields/base'
import c from 'classnames'
import TreeSelect from '@components/tree-select'
import Scroll from '@components/scroll'
import w from '@models'

import s from './interaction.module.styl'

const TargetSelect = ({onChange, defaultValue}) => {
  const {art} = w.editor.getCurrentTab()
  const actionTargets = art?.viewport?.getAllBoxs()
  return (
    <Field childrenClassName={c(s.lineHeight_initial)} className={c('mr8 ml24', s.baseLine)} label="目标对象">
      <Scroll className="w100p">
        <TreeSelect defaultValue={defaultValue} onChange={onChange} options={actionTargets} />
      </Scroll>
    </Field>
  )
}

export default TargetSelect
