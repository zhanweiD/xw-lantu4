import React, {useState, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import IconButton from '@components/icon-button'
import w from '@models'
import s from './data-toolbar.module.styl'

const DataToolbar = ({useCreate}) => {
  const [keyword, setKeyword] = useState('')
  const {t} = useTranslation()
  const {sidebar} = w
  const {dataPanel} = sidebar
  const {set, getDataType} = dataPanel
  useEffect(() => {
    set({projectKeyword: ''})
    set({keyword: ''})
  }, [])
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
      {keyword && (
        <IconButton
          icon="close"
          title={t('remove')}
          onClick={() => (setKeyword(''), getDataType() === 'project' ? set({projectKeyword: ''}) : set({keyword: ''}))}
        />
      )}
      <IconButton
        icon="search"
        title={t('search')}
        className="cfw8"
        onClick={() => (getDataType() === 'project' ? set({projectKeyword: keyword}) : set({keyword}))}
      />
      {useCreate && (
        <IconButton
          icon="create-data"
          className="cfw12"
          title={t('dataPanel.createDataFold')}
          onClick={(e) => (e.stopPropagation(), set({isVisible: true}))}
        />
      )}
    </div>
  )
}

export default observer(DataToolbar)
