import React from 'react'
import c from 'classnames'
import {observer} from 'mobx-react-lite'
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import Head from '@views/head'
import Footer from '@views/footer'
import Sidebar from '@views/sidebar'
import Menu from '@components/menu'
import Confirm from '@components/confirm'
import ColorPicker from '@components/color-picker'
import OptionPanel from '@views/option-panel'
import Editor from '@views/editor'
import Loading from '@components/loading'
import w from '@models'

import s from './main.module.styl'

const Main = () => {
  const {editor, user} = w
  const {activeTabId, tabs} = editor
  const activeTab = tabs.filter((tab) => tab.id === activeTabId)[0] || {}
  const {art} = activeTab
  const {isArtPublishInfoVisible, isVersionManagementVisible} = art || {}
  if (!user.userId)
    return (
      <div className="w100p h100v fbv fbjc fbac">
        <Loading data="loading" />
      </div>
    )
  return (
    <div className={c('fbv', s.main)}>
      <Head />
      <DndProvider backend={HTML5Backend}>
        <div className="fb1 fbh oh pr">
          <Sidebar />
          <Editor />
          <OptionPanel />
        </div>
      </DndProvider>
      <Footer />
      <Menu model={w.overlayManager.get('menu')} />
      <Confirm model={w.overlayManager.get('confirm')} />
      <ColorPicker model={w.overlayManager.get('colorPicker')} />
      {(isArtPublishInfoVisible || isVersionManagementVisible) && <div className="montmorillonite"></div>}
    </div>
  )
}

export default observer(Main)
