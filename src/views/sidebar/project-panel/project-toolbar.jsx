import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import IconButton from '@components/icon-button'
import s from './project-toolbar.module.styl'
import {createConfigModelClass} from '@components/field'
import Modal from '@components/modal'
import w from '@models'

// 创建项目的 field 表单
const MFieldModdal = createConfigModelClass('MFieldModdal', {
  sections: ['__hide__'],
  fields: [
    {
      section: '__hide__',
      option: 'name',
      field: {
        type: 'text',
        label: 'name',
        placeholder: 'namePlaceholder',
        required: true,
      },
    },
    {
      section: '__hide__',
      option: 'description',
      field: {
        type: 'textarea',
        label: 'description.description',
        placeholder: 'detailPlaceholder',
      },
    },
  ],
})

const Toolbar = ({useCreateButton}) => {
  const {t} = useTranslation()
  const {sidebar} = w
  const {projectPanel} = sidebar
  const {keyword, set, toggleDisplay, isThumbnailVisible, isCreateModalVisible, createProject} = projectPanel
  const modal = MFieldModdal.create()
  const getProjectSchema = () => ({name: modal.name.value, description: modal.description.value})
  return (
    <div className={c('fbh fbac cfw2 pl8', s.toolbar)}>
      <input
        type="text"
        value={keyword}
        placeholder={t('searchPlaceholder')}
        onChange={(e) => set('keyword', e.target.value)}
      />
      {keyword && <IconButton icon="close" title={t('remove')} onClick={() => set('keyword', '')} />}
      <IconButton icon="search" className="cfw6" title={t('search')} />
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
        width={350}
        title="新建项目"
        model={modal}
        isVisible={isCreateModalVisible}
        buttons={[
          {name: '取消', action: () => set('isCreateModalVisible', false)},
          {name: '确定', action: () => (set('isCreateModalVisible', false), createProject(getProjectSchema()))},
        ]}
      />
    </div>
  )
}

export default observer(Toolbar)
