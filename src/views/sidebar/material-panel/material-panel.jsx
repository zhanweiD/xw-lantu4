import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import Tab from '@components/tab'
import Icon from '@components/icon'
import Loading from '@components/loading'
import IconButton from '@components/icon-button'
import w from '@models'
import Modal from '@components/modal'
import Scroll from '@components/scroll'
import {TextField} from '@components/field'
import MaterialFolder from './material-folder'
import s from './material-panel.module.styl'
import MaterialToolbar from './material-toolbar'

const MoreIcon = ({materialPanel, folder, isTop}) => {
  const {toggleFolderTop, exportFolder, removeFolder} = materialPanel
  const menu = w.overlayManager.get('menu')
  const onClickMore = (e, button) => {
    e.stopPropagation()
    menu.toggle({
      attachTo: button,
      list: [
        {name: '上传素材', action: () => (folder.set({isVisible: true}), menu.hide())},
        {name: `${isTop ? '取消置顶' : '置顶'}文件夹`, action: () => (toggleFolderTop(folder), menu.hide())},
        {name: '导出文件夹', action: () => (exportFolder(folder), menu.hide())},
        {name: '删除文件夹', action: () => (removeFolder(folder), menu.hide())},
      ],
    })
  }
  return (
    <div className="pr oh">
      {isTop && <div className={s.delta} />}
      <IconButton icon="more" buttonSize={24} onClick={onClickMore} />
    </div>
  )
}

// 素材面板无项目时的 UI
const MaterialFallback = ({keyword, set, noProject}) =>
  keyword ? (
    <div className={c('m8 emptyNote')}>
      <div className="fbh fbjc">{`抱歉，没有找到与"${keyword}"相关的素材`}</div>
    </div>
  ) : noProject ? (
    <div className="fbv fbac fbjc mt30 pt30">
      <div className="p10 fbv fbac fs10 lh32">
        <Icon name="logo" fill="#fff5" size={42} />
        <div className="ctw52">当前无关联的项目</div>
      </div>
    </div>
  ) : (
    <div className="fbv fbac fbjc mt30 pt30">
      <div className="p10 fbv fbac fs10 lh32">
        <Icon name="logo" fill="#fff5" size={42} />
        <div className="ctw52">素材列表还是空空的，点击下面的按钮启程</div>
        <div className="greenButton noselect" onClick={() => set({isVisible: true})}>
          新建素材文件夹
        </div>
      </div>
    </div>
  )

const OfficialMaterialFallback = ({keyword}) =>
  keyword ? (
    <div className={c('m8 emptyNote')}>
      <div className="fbh fbjc">{`抱歉，没有找到与"${keyword}"相关的素材`}</div>
    </div>
  ) : (
    <div className="fbv fbac fbjc mt30 pt30">
      <div className="p10 fbv fbac fs10 lh32">
        <Icon name="logo" fill="#fff5" size={42} />
        <div className="ctw52">暂无官方素材</div>
      </div>
    </div>
  )

const MaterialPanel = () => {
  const {t} = useTranslation()
  const [name, setName] = useState('')
  const {sidebar} = w
  const {materialPanel} = sidebar
  const {
    set,
    state,
    folders_,
    projectFolders_,
    officialFolders_,
    projectId,
    showType,
    keyword,
    isVisible,
    createFolder,
  } = materialPanel
  const {basicFolders, topFolders} = folders_
  const {basicProjectFolders, topProjectFolders} = projectFolders_

  return (
    <Loading data={state}>
      <Tab sessionId="material-panel-tab" bodyClassName="fbv" className="w100p h100p">
        <Tab.Item name={t('materialPanel.project')}>
          <MaterialToolbar useCreate={projectId} />
          <Scroll className="h100p">
            {topProjectFolders.map((folder) => (
              <MaterialFolder
                icon={<MoreIcon materialPanel={materialPanel} folder={folder} isTop />}
                key={folder.folderId}
                folder={folder}
                showType={showType}
              />
            ))}
            {basicProjectFolders.map((folder) => (
              <MaterialFolder
                icon={<MoreIcon materialPanel={materialPanel} folder={folder} />}
                key={folder.folderId}
                folder={folder}
                showType={showType}
              />
            ))}
            {!basicProjectFolders.length && !topProjectFolders.length && (
              <MaterialFallback keyword={keyword} set={set} noProject={!projectId} />
            )}
          </Scroll>
        </Tab.Item>
        <Tab.Item name={t('materialPanel.space')}>
          <MaterialToolbar useCreate />
          <Scroll className="h100p">
            {topFolders.map((folder) => (
              <MaterialFolder
                icon={<MoreIcon materialPanel={materialPanel} folder={folder} isTop />}
                key={folder.folderId}
                folder={folder}
                showType={showType}
              />
            ))}
            {basicFolders.map((folder) => (
              <MaterialFolder
                icon={<MoreIcon materialPanel={materialPanel} folder={folder} />}
                key={folder.folderId}
                folder={folder}
                showType={showType}
              />
            ))}
            {!basicFolders.length && !topFolders.length && <MaterialFallback keyword={keyword} set={set} />}
          </Scroll>
        </Tab.Item>
        <Tab.Item name={t('materialPanel.official')}>
          <MaterialToolbar />
          <Scroll className="h100p">
            {officialFolders_.map((folder) => (
              <MaterialFolder key={folder.folderId} folder={folder} showType={showType} />
            ))}
            {!officialFolders_.length && <OfficialMaterialFallback keyword={keyword} />}
          </Scroll>
        </Tab.Item>
      </Tab>
      <Modal
        title="新建文件夹"
        width={360}
        isVisible={isVisible}
        onClose={() => set({isVisible: false})}
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
          placeholder={t('namePlaceholder')}
        />
      </Modal>
    </Loading>
  )
}

export default observer(MaterialPanel)
