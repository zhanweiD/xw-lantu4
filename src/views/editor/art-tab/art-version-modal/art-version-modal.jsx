import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import Table from '@components/table'
import Modal from '@components/modal'
import {TextField} from '@components/field'
import config from '@utils/config'
import moment from 'moment'
import s from './modal.module.styl'

const VersionModal = ({art}) => {
  // 从哪里来？
  const {artPublishInfo = {}, isVersionManagementVisible} = art
  const {list = [], remark} = artPublishInfo
  // 构架状态  0 普通模式  1 构建中（取消后状态设置为0） 2 构建完成可下载
  const [buildStatus, setBuildStatus] = useState('normal')
  const buildButton = {
    normal: '导出',
    build: '构建中...',
    finish: '下载',
  }
  const {t} = useTranslation()
  const columns = [
    {
      key: 'ctime',
      title: '创建日期',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      key: 'status',
      title: '状态',
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
          <div className={c(s.copyButton, 'pl8 pr8 hand cfw16')}>下载</div>
          <div
            className={c(s.copyButton, 'pl8 pr8 ml8 hand cfw16', {
              [s.disableButton]: rowData.isOnline,
            })}
          >
            删除
          </div>
        </div>
      ),
    },
  ]
  const href = `${window.location.origin}${config.pathPrefix}`
  const buildFun = () => {
    if (buildStatus === 'build') return
    if (buildStatus === 'normal') {
      // !TODO 构建操作
      setBuildStatus('build')
    }
    if (buildStatus === 'finish') {
      // !TODO 下载操作
    }
  }

  const cancelBuild = () => {
    setBuildStatus('normal')
  }
  return (
    <>
      <Modal
        title={t('art.versionManagement')}
        width={700}
        height={550}
        isVisible={isVersionManagementVisible}
        onClose={() => {
          art.set({
            isVersionManagementVisible: false,
          })
        }}
      >
        <div className="p28 pt24 pb24 fb1">
          <div className={c(s.align, 'fbh')}>
            <span>部署配额</span>
            <span className="ml8 mr4 hand">8</span>
            <span className="ml4 mr4 ">/</span>
            <span className="ml4 mr4 ">50</span>
            <span>查看所以部署记录</span>
          </div>
          <div className={c(s.align, 'fbh mt24')}>
            <span>链接</span>
            <span className="fb1 ml12 mr12 hand" onClick={() => window.open(href)}>
              <TextField readOnly value={href} className="fb1" />
            </span>
            {/* <div
              className={c(s.copyButton, 'pl8 pr8 hand cfw16')}
              // onClick={() => {
              //   artPublishInfo.copyUrl(href)
              // }}
            >
              选择
            </div> */}
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
          </div>
          <div
            className={c(s.publishButton, 'mt24 mb24 hand ctw', list && list.length > 4 && s.disableButton)}
            onClick={buildFun}
          >
            {buildButton[buildStatus]}
          </div>
          {buildStatus === 'build' && (
            <div className={c('mb24 hand ctw center ')}>
              工程文件构建需要一些时间，构建完成后可下载，可点击
              <span className={c(s.tipsBtn, 'hand')} onClick={cancelBuild}>
                取消
              </span>
            </div>
          )}
          {buildStatus === 'finish' && (
            <div className={c('mb24 hand ctw center ')}>构建完成，点击下载按钮可下载部署工程文件</div>
          )}
          <div className={c('mb8 hand')}>部署记录</div>
          <Table dataSource={list} columns={columns} placeholder="暂无部署版本" />
        </div>
      </Modal>
    </>
  )
}

export default observer(VersionModal)
