import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import {TextField} from '@components/field'
import c from 'classnames'
import IconButton from '@components/icon-button'
import s from './project-toolbar.module.styl'
import Modal from '@components/modal'
import w from '@models'

const Toolbar = ({useCreateButton}) => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {projectPanel} = sidebar
  const {set, toggleDisplay, isThumbnailVisible, isCreateModalVisible, createProject} = projectPanel
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [keyword, setKeyword] = useState('')
  return (
    <div className={c('fbh fbac cfw2 pl8', s.toolbar)}>
      <input
        type="text"
        value={keyword}
        placeholder={t('searchPlaceholder')}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {keyword && <IconButton icon="close" title={t('remove')} onClick={() => (setKeyword(''), set({keyword: ''}))} />}
      <IconButton icon="search" className="cfw6" title={t('search')} onClick={() => set({keyword})} />
      <IconButton
        icon={isThumbnailVisible ? 'thumbnail-list' : 'list'}
        title="显示切换"
        className="cfw10"
        onClick={toggleDisplay}
      />
      {useCreateButton && (
        <IconButton
          icon="create-project"
          title={t('projectPanel.createProject')}
          className="cfw10"
          onClick={() => set('isCreateModalVisible', true)}
        />
      )}
      <Modal
        width={360}
        title="新建项目"
        isVisible={isCreateModalVisible}
        buttons={[
          {name: '取消', action: () => set('isCreateModalVisible', false)},
          {name: '确定', action: () => createProject({name, description}, () => set('isCreateModalVisible', false))},
        ]}
      >
        <TextField
          value={name}
          onChange={(value) => setName(value)}
          className="pt8 pb8"
          label={t('name')}
          placeholder={t('namePlaceholder')}
        />
        <TextField
          value={description}
          onChange={(value) => setDescription(value)}
          className="pt8 pb8"
          label={t('description.description')}
          placeholder={t('descriptionPlaceholder')}
        />
      </Modal>
    </div>
  )
}

export default observer(Toolbar)
