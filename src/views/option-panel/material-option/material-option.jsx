import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import moment from 'moment'

import {TextField, TextareaField, NumberField} from '@components/field'
import Tab from '@components/tab'
import Section from '@components/section'
import Scroll from '@components/scroll'

const MaterialOption = ({material}) => {
  const {user, ctime, name, description, height, width, materialId} = material
  const {t} = useTranslation()
  return (
    <Tab sessionId="material-option" className="fb1">
      <Tab.Item name={t('material.info')}>
        <Scroll className="h100p">
          {/* 日志信息 */}
          <Section name={t('materialPanel.logInfo')} childrenClassName="pt8 pb8" sessionId="material-log">
            <TextField label={t('materialPanel.creater')} value={user?.nickname || ''} readOnly />
            <TextField label={t('materialPanel.ctime')} value={moment(ctime).format('YYYY-MM-DD HH:mm:ss')} readOnly />
          </Section>
          {/* 基础信息 */}
          <Section name={t('materialPanel.basicInfo')} childrenClassName="pt8 pb8" sessionId="material-basic">
            <TextField label={t('name')} value={name} onChange={(value) => material.set({name: value})} />
            <TextareaField
              label={t('description')}
              value={description}
              onChange={(value) => material.set({description: value})}
            />
            <TextareaField label={t('materialPanel.filePath')} value={materialId} readOnly />
            {material.type === 'image' ? (
              <>
                <NumberField label={t('width')} readOnly value={width} />
                <NumberField label={t('height')} readOnly value={height} />
              </>
            ) : null}
          </Section>
        </Scroll>
      </Tab.Item>
    </Tab>
  )
}

export default observer(MaterialOption)
