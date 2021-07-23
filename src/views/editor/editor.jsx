import React from "react"
import {observer} from "mobx-react-lite"
// import {useTranslation} from 'react-i18next'
import c from "classnames"
// import w from '@models'
// import IconButton from '@components/icon-button'
// import config from '@utils/config'
// import EditorTab from './editor-tab'
import s from "./editor.module.styl"

const Editor = () => {
  return <div className={c("fb1 fbh", s.editor)}>editor</div>
}

export default observer(Editor)
