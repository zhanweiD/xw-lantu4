import React, {useEffect, useState} from 'react'
import fields from '@builders/fields'

const {TextField} = fields

export default function Href({defaultValue = {}, onChange}) {
  const {href} = defaultValue
  const [state, setState] = useState(href)
  useEffect(() => {
    onChange && onChange({href: state})
  }, [state])
  return <TextField label="链接" className="mr8 ml24" value={state} onChange={(v) => setState(v)} />
}
