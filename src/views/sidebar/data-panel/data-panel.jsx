import React, {useState} from 'react'
import DataFolder from './data-folder'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import w from '@models'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import Icon from '@components/icon'
import IconButton from '@components/icon-button'
import Modal from '@components/modal'
import {TextField} from '@components/field'
import DataToolbar from './data-toolbar'
import s from './data-panel.module.styl'
import Loading from '@components/loading'

const MoreIcon = ({dataPanel, folder, isTop}) => {
  const {toggleFolderTop, confirm} = dataPanel
  const {createData, folderId} = folder
  const menu = w.overlayManager.get('menu')
  const onClickMore = (e, button) => {
    e.stopPropagation()
    menu.toggle({
      attachTo: button,
      list: [
        {name: `${isTop ? '取消置顶' : '置顶'}文件夹`, action: () => (toggleFolderTop(folder), menu.hide())},
        {name: '新建Excel', action: () => (createData({folderId, dataType: 'excel'}), menu.hide())},
        {name: '新建JSON', action: () => (createData({folderId, dataType: 'json'}), menu.hide())},
        {name: '新建API', action: () => (createData({folderId, dataType: 'api'}), menu.hide())},
        {name: '删除文件夹', action: () => (confirm(folder, 'removeFolder'), menu.hide())},
      ],
    })
  }
  return (
    <div className="pr oh">
      {isTop && <div className={s.delta} />}
      <IconButton buttonSize={24} icon="more" onClick={onClickMore} />
    </div>
  )
}

// 数据面板无项目时的 UI
const DataPanelFallback = ({keyword, set, noProject}) =>
  keyword ? (
    <div className={c('m8 emptyNote')}>
      <div className="fbh fbjc">{`抱歉，没有找到与"${keyword}"相关的素材`}</div>
    </div>
  ) : noProject ? (
    <div className="fbv fbac fbjc mt30 pt30">
      <div className="p10 fbv fbac fs10 lh32">
        <Icon name="logo" fill="#fff5" size={42} />
        <div className="ctw52">当前无关联的数据屏</div>
      </div>
    </div>
  ) : (
    <div className="fbv fbac fbjc mt30 pt30">
      <div className="p10 fbv fbac fs10 lh32">
        <Icon name="logo" fill="#fff5" size={42} />
        <div className="ctw52">空间数据还是空空的，点击下面的按钮启程</div>
        <div className="greenButton noselect" onClick={() => set({isVisible: true})}>
          新建数据文件夹
        </div>
      </div>
    </div>
  )

const DataPanel = () => {
  const {t} = useTranslation()
  const [name, setName] = useState('')
  const {sidebar} = w
  const {dataPanel} = sidebar
  const {set, state, folders_, keyword, projectKeyword, projectId, isVisible, createFolder} = dataPanel
  const {basicSpaceFolders, topSpaceFolders, basicProjectFolders, topProjectFolders} = folders_
  const hasSpaceData = !basicSpaceFolders.length && !topSpaceFolders.length
  const hasProjectData = !basicProjectFolders.length && !topProjectFolders.length

  return (
    <Loading data={state}>
      <Tab sessionId="data-panel-tab" bodyClassName="fbv" className="wh100p">
        <Tab.Item name={t('dataPanel.project')}>
          <DataToolbar useCreate={projectId} />
          <Scroll className="h100p">
            {topProjectFolders.map((folder) => (
              <DataFolder
                icon={<MoreIcon dataPanel={dataPanel} folder={folder} isTop />}
                key={folder.folderId}
                folder={folder}
              />
            ))}
            {basicProjectFolders.map((folder) => (
              <DataFolder
                icon={<MoreIcon dataPanel={dataPanel} folder={folder} />}
                key={folder.folderId}
                folder={folder}
              />
            ))}
            {hasProjectData && <DataPanelFallback keyword={projectKeyword} set={set} noProject={!projectId} />}
          </Scroll>
        </Tab.Item>
        <Tab.Item name={t('dataPanel.space')}>
          <div className={c('h100p fbv')}>
            <DataToolbar useCreate />
            <Scroll>
              {topSpaceFolders.map((folder) => (
                <DataFolder
                  icon={<MoreIcon dataPanel={dataPanel} folder={folder} isTop />}
                  key={folder.folderId}
                  folder={folder}
                />
              ))}
              {basicSpaceFolders.map((folder) => (
                <DataFolder
                  icon={<MoreIcon dataPanel={dataPanel} folder={folder} />}
                  key={folder.folderId}
                  folder={folder}
                />
              ))}

              {hasSpaceData && <DataPanelFallback keyword={keyword} set={set} />}
            </Scroll>
          </div>
        </Tab.Item>

        <Tab.Item name={t('dataPanel.official')}>
          <DataToolbar dataPanel={dataPanel} />
          <div className="fbv fbac fbjc mt30 pt30">
            <div className="p10 fbv fbac fs10 lh32">
              <Icon name="logo" fill="#fff5" size={42} />
              <div className="ctw52">暂无官方数据</div>
            </div>
          </div>
        </Tab.Item>
      </Tab>
      <Modal
        title="新建数据文件夹"
        height={160}
        width={320}
        isVisible={isVisible}
        onClose={() => (set({isVisible: false}), setName(''))}
        buttons={[
          {name: '取消', action: () => (set({isVisible: false}), setName(''))},
          {name: '新增', action: () => createFolder(name, () => setName(''))},
        ]}
      >
        <TextField
          value={name}
          onChange={(value) => setName(value)}
          className="pt8 pb8"
          label={t('name')}
          placeholder="文件夹名称不能为空、重复"
        />
      </Modal>
    </Loading>
  )
}

export default observer(DataPanel)
