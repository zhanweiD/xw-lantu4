import React from 'react'
import {observer} from 'mobx-react-lite'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-mysql'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-searchbox'
import c from 'classnames'
import random from '@utils/random'
import s from './code-board.module.styl'

const Codeboard = ({onChange = () => undefined, mode = 'javascript', className, ...restOptions}) => (
  <AceEditor
    onChange={(value) => {
      onChange(value)
    }}
    onLoad={(aceInstance) => {
      aceInstance.setOptions({useWorker: false})
    }}
    className={c(s.codeBoard, className)}
    mode={mode}
    theme="monokai"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restOptions}
    width="100%"
    height="100%"
    focus={false}
    tabSize={2}
    name={random()}
  />
)

export default observer(Codeboard)
