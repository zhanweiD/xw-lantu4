import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import Table from '@components/table'
import Modal from '@components/modal'
import {TextField} from '@components/field'
import s from './modal.module.styl'

const VersionModal = ({art}) => {
  // 从哪里来？
  const {artPublishInfo = {}, isVersionManagementVisible} = art
  const {list, remark} = artPublishInfo
  console.log(isVersionManagementVisible)
  const {t} = useTranslation()
  const columns = []
  return (
    <>
      <Modal
        title={t('art.publishManagement')}
        width={700}
        height={550}
        isVisible={isVersionManagementVisible}
        onClose={() => {
          art.set({
            isArtPublishInfoVisible: false,
          })
        }}
      >
        <div className="p28 pt24 pb24 fb1">
          <div className={c(s.align, 'fbh mt24')}>
            <span>备注</span>
            <TextField
              placeholder="非必填，最多32个字符"
              className="fb1 ml12 mr12"
              value={remark || ''}
              onChange={(value) => {
                artPublishInfo.set({
                  remark: value,
                })
              }}
            />
          </div>
          <Table dataSource={list} columns={columns} placeholder="暂无部署版本" />
        </div>
      </Modal>
    </>
  )
}

export default observer(VersionModal)
