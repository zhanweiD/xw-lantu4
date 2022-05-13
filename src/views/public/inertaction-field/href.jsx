import React, {useEffect, useState} from 'react'
import fields from '@builders/fields'

const {TextField} = fields

export default function Href({defaultValue = '', onChange}) {
  const [state, setState] = useState(defaultValue)
  useEffect(() => {
    onChange && onChange(state)
  }, [state])
  return <TextField label="链接" className="mr8 ml24" value={state} onChange={(v) => setState(v)} />
}
