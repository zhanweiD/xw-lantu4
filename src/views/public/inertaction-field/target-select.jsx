import React, {useCallback, useRef} from 'react'
import {Field} from '@builders/fields/base'
import c from 'classnames'
import TreeSelect from '@components/tree-select'
import Scroll from '@components/scroll'
import w from '@models'

import s from './interaction.module.styl'

function toggleOutlineById(id, flag) {
  let boxDom = document.getElementById(`box-${id}`)
  if (boxDom && boxDom.style) {
    boxDom.style.outline = flag ? '#07f solid 2px' : ''
    boxDom = null
  }
}

const TargetSelect = ({onChange, defaultValue}) => {
  const {art} = w.editor.getCurrentTab()
  const actionTargets = art?.viewport?.getAllBoxs()
  const onEnterTarget = useCallback((node) => {
    toggleOutlineById(node.key, true)
  }, [])
  return (
    <Field childrenClassName={c(s.lineHeight_initial)} className={c('mr8 ml24', s.baseLine)} label="目标对象">
      <Scroll className="w100p">
        <TreeSelect
          defaultValue={defaultValue}
          onChange={onChange}
          options={actionTargets}
          onNodeLeave={(node) => {
            toggleOutlineById(node.key, false)
          }}
          onNodeEnter={onEnterTarget}
        />
      </Scroll>
    </Field>
  )
}

export default TargetSelect
