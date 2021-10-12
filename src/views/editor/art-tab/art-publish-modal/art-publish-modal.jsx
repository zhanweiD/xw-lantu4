import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import moment from 'moment'
import c from 'classnames'
import Table from '@components/table'
import Modal from '@components/modal'
import config from '@utils/config'
import {TextField} from '@components/field'
import s from './modal.module.styl'

const PublishModal = ({art}) => {
  const {artPublishInfo = {}, isArtPublishInfoVisible} = art
  const {list, publishId, remark} = artPublishInfo
  const {t} = useTranslation()
  const columns = [
    {
      key: 'ctime',
      title: '创建日期',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: 'remark',
      title: '备注',
    },
    {
      title: '操作',
      /* eslint-disable */
      render: (val, rowData) => (
        <div className="fbh h100p fbac">
          {rowData.isOnline ? (
            <div
              className={c(s.copyButton, 'pl8 pr8 hand cfw16')}
              onClick={() => artPublishInfo.offline(rowData.versionId)}
            >
              下线
            </div>
          ) : (
            <div
              className={c(s.copyButton, 'pl8 pr8 hand cfw16', {
                [s.disableButton]: rowData.isOnline,
              })}
              onClick={() => artPublishInfo.online(rowData.versionId)}
            >
              上线
            </div>
          )}
          <div
            className={c(s.copyButton, 'pl8 pr8 ml8 hand cfw16', {
              [s.disableButton]: rowData.isOnline,
            })}
            onClick={() => artPublishInfo.remove(rowData.versionId)}
          >
            删除
          </div>
        </div>
      ),
    },
  ]
  const href = `${window.location.origin}${config.pathPrefix}/publish/${publishId}`
  return (
    <>
      <Modal
        title={t('art.publishManagement')}
        width={700}
        height={550}
        isVisible={isArtPublishInfoVisible}
        onClose={() => {
          art.set({
            isArtPublishInfoVisible: false,
          })
        }}
      >
        <div className="p28 pt24 pb24 fb1">
          <div className={c(s.align, 'fbh')}>
            <span>链接</span>
            <span className="fb1 ml12 mr12 hand" onClick={() => window.open(href)}>
              <TextField readOnly value={href} className="fb1" />
            </span>
            <div
              className={c(s.copyButton, 'pl8 pr8 hand cfw16')}
              onClick={() => {
                artPublishInfo.copyUrl(href)
              }}
            >
              复制
            </div>
          </div>
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
            <div className={c(s.copyButton, 'pl8 pr8 cfw16 o0p')}>复制</div>
          </div>
          <div
            className={c(s.publishButton, 'mt24 mb8 hand ctw', list && list.length > 4 && s.disableButton)}
            onClick={() => {
              artPublishInfo.publish()
            }}
          >
            确认发布
          </div>
          <div className={c('mt8 mb8 ctw48 fbh fbjc')}>提示：本次发布将创建新的版本上线,最多可发布5次</div>
          <div className={c('mt24 mb8 ctw64')}>历史版本</div>
          <Table dataSource={list} columns={columns} placeholder="暂无历史版本" />
        </div>
      </Modal>
    </>
  )
}

export default observer(PublishModal)
