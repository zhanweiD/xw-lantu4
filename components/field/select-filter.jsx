import React from 'react'
import {observer} from 'mobx-react-lite'
import {SelectField} from './select'

// TODO 后续需要增加功能
export const SelectFilterField = observer((props) => {
  return <SelectField {...props} />
})
