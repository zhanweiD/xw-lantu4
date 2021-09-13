import IconButton from '@components/icon-button'
import w from '@models'
import c from 'classnames'
import {observer} from 'mobx-react-lite'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import s from './material-panel.module.styl'

const MaterialToolbar = ({useCreate}) => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {materialPanel} = sidebar
  const {showType, set} = materialPanel
  const [keyword, setKeyword] = useState('')
  return (
    <div className={c('fbh fbac cfw2 pl8', s.toolbar)}>
      <div className="fb1">
        <input
          type="text"
          value={keyword}
          placeholder={t('searchPlaceholder')}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      {keyword && <IconButton icon="close" title={t('remove')} onClick={() => (setKeyword(''), set({keyword: ''}))} />}
      <IconButton icon="search" className="cfw6" title={t('search')} onClick={() => set({keyword})} />
      <IconButton icon={showType} className="cfw10" title="显示切换" onClick={materialPanel.toggleShowType} />
      {useCreate && (
        <IconButton
          icon="create-material"
          className="cfw12"
          title={t('materialPanel.materialCreate')}
          onClick={(e) => (e.stopPropagation(), set({isVisible: true}))}
        />
      )}
    </div>
  )
}

export default observer(MaterialToolbar)
