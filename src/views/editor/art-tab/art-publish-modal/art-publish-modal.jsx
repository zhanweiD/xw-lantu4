import React from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import moment from 'moment'
import c from 'classnames'
import Table from '@components/table'
import Modal from '@components/modal'
import config from '@utils/config'
import tip from '@components/tip'
import {TextField} from '@components/field'
import s from './modal.module.styl'

const PublishModal = ({art}) => {
  // 从哪里来？
  const {artPublishInfo = {}, isArtPublishInfoVisible, global, isPrivate} = art
  const {list, publishId, remark, publishPassword} = artPublishInfo
  /*
  const {
    options: {
      sections: {
        auth: {
          // eslint-disable-next-line no-unused-vars
          fields: {password: model},
        },
      },
    },
  } = global
  */

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
          <div className={c('fbh mt24')}>
            <span className={c('mr24')}>分享范围</span>
            {/* <input
              checked={!isPrivate}
              style={{backgroundColor: 'transparent'}}
              onChange={(e) => {
                e.target.checked && artPublishInfo.set({publishPassword: ''})
                art.set({isPrivate: false})
              }}
              type="radio"
            ></input> */}
            <div
              className={c(s.radioDiv, !isPrivate ? s.checkRadioDiv : '', 'hand fbh fbac fbjc')}
              onClick={(e) => {
                e.target.checked && artPublishInfo.set({publishPassword: ''})
                art.set({isPrivate: false})
              }}
            >
              {!isPrivate && <div className={c(s.checkRadioBG)}></div>}
            </div>
            <span className={c('ml10 mr32')}>公开</span>
            {/* <input
              checked={isPrivate}
              onChange={(e) => {
                art.set({isPrivate: true})
              }}
              style={{backgroundColor: 'transparent'}}
              type="radio"
            ></input> */}
            <div
              className={c(s.radioDiv, isPrivate ? s.checkRadioDiv : '', 'hand fbh fbac fbjc')}
              onClick={(e) => {
                art.set({isPrivate: true})
              }}
            >
              {isPrivate && <div className={c(s.checkRadioBG)}></div>}
            </div>
            <span className={c('ml10')}>私密</span>
          </div>
          {isPrivate && (
            <div className={c(s.align, 'fbh mt24')}>
              <span>密码</span>
              <TextField
                type="password"
                className="fb1 ml12 mr12"
                value={publishPassword}
                placeholder="请输入密码"
                onChange={(v) => {
                  artPublishInfo.set({publishPassword: v})
                }}
              />
            </div>
          )}
          <div
            className={c(s.publishButton, 'mt24 mb8 hand ctw', list && list.length > 4 && s.disableButton)}
            onClick={() => {
              if (isPrivate) {
                if (!publishPassword) {
                  tip.error({content: '请输入密码'})
                } else {
                  artPublishInfo.publish(isPrivate)
                }
                return
              }
              artPublishInfo.publish(isPrivate)
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
