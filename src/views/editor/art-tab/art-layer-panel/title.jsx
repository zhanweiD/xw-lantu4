import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'

/**
 * 标题
 */
const Title = ({name, onChange}) => {
  const [contentEditable, setContentEditable] = useState(false)
  return (
    <div
      className="fb1 omit"
      onKeyDown={(e) => {
        if (!e.target.innerHTML.length) {
          e.target.innerHTML = name
        }
        if (e.key !== 'Enter') {
          return
        }
        onChange(e.target.innerText)
        setContentEditable(false)
      }}
      onDoubleClick={() => {
        setContentEditable(true)
      }}
      onBlur={(e) => {
        if (!e.target.innerHTML.length) {
          return
        }
        onChange(e.target.innerText)
        setContentEditable(false)
      }}
      contentEditable={contentEditable}
      // NOTE：为了防止报错，必须加上 suppressContentEditableWarning
      suppressContentEditableWarning="true"
      style={{
        cursor: contentEditable ? 'text' : '',
      }}
    >
      {name}
    </div>
  )
}

export default observer(Title)
