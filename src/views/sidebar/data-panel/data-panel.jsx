import React, {useState, Children} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'react-i18next'
import c from 'classnames'
import w from '@models'
import Tab from '@components/tab'
import Scroll from '@components/scroll'
import Section from '@components/section'
import Icon from '@components/icon'
import IconButton from '@components/icon-button'
import Grid from '@components/grid'
import Modal from '@components/modal'
import {TextField} from '@components/field'
import DataToolbar from './data-toolbar'
import DataThumbnail from './data-thumbnail'
import s from './data-panel.module.styl'
import Loading from '@components/loading'

const createMenu = (e, button, dataPanel, folder, isTop, isOnClickMore) => {
  const {toggleFolderTop, removeFolder, openTabByData} = dataPanel
  e.stopPropagation()
  const menu = w.overlayManager.get('menu')
  const createList = [
    {name: '新建Excel', action: () => (openTabByData({folder, type: 'excel'}), menu.hide())},
    {name: '新建JSON', action: () => (openTabByData({folder, type: 'json'}), menu.hide())},
    {name: '新建API', action: () => (openTabByData({folder, type: 'api'}), menu.hide())},
    // {name: '新建SQL',action: () => (openTabByData({folder, type: 'database'}), menu.hide())},
  ]
  const list = [
    {name: `${isTop ? '取消置顶' : '置顶'}文件夹`, action: () => (toggleFolderTop(folder), menu.hide())},
    ...createList,
    {name: '删除文件夹', action: () => (removeFolder(folder), menu.hide())},
  ]
  menu.toggle({
    attachTo: button,
    list: isOnClickMore ? list : createList,
  })
}

const MoreIcon = ({dataPanel, folder, isTop}) => {
  return (
    <div className="pr oh">
      {isTop && <div className={s.delta} />}
      <IconButton
        buttonSize={24}
        icon="more"
        onClick={(e, button) => {
          createMenu(e, button, dataPanel, folder, isTop, true)
        }}
      />
    </div>
  )
}

const DataFolders = observer(({dataPanel, folder, icon, onNoDataClick}) => {
  // TODO 多语言
  // const {t} = useTranslation()
  const {toolbar} = dataPanel
  // const {datas_, folderName, section, env_ = {}} = folder
  const {datas_, folderName, section} = folder

  // const {session} = env_

  return (
    <Section
      className="pl8 pr8 mt8"
      childrenClassName="pt8"
      icon={icon}
      name={`${folderName} (${datas_.length})`}
      props={section}
      onFold={() => {
        // session.set(section.sectionKey, fold)
      }}
    >
      {datas_.length ? (
        toolbar.showtype === 'grid-layout' ? (
          <Grid column={toolbar.showtype === 'grid-layout' ? 4 : 1}>
            {datas_.map((data) =>
              Children.toArray(
                <Grid.Item>
                  <DataThumbnail
                    folder={folder}
                    data={data}
                    // toolbar={toolbar}
                    // isLast={index === datas_.length - 1}
                    dataPanel={dataPanel}
                  />
                </Grid.Item>
              )
            )}
          </Grid>
        ) : (
          datas_.map((data) =>
            Children.toArray(
              <DataThumbnail
                data={data}
                dataPanel={dataPanel}
                // toolbar={toolbar}
                // isLast={index === datas_.length - 1}
                // index={index}
                folder={folder}
              />
            )
          )
        )
      ) : (
        <div className={c('mb16 emptyNote')}>
          <div>
            列表还是空空的，点击
            <span className="ctSecend hand" onClick={onNoDataClick}>
              新建
            </span>
          </div>
        </div>
      )}
    </Section>
  )
})

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
        <div className="ctw52">数据列表还是空空的，点击下面的按钮启程</div>
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
  const {set, state, folders_, hasData_, keyword, projectId, isVisible, createFolder} = dataPanel

  return (
    <Loading data={state}>
      <Tab sessionId="data-panel-tab" bodyClassName="fbv" className="wh100p">
        <Tab.Item name={t('dataPanel.project')}>
          <DataToolbar useCreate={hasData_} />
          <Scroll className="h100p">
            <DataPanelFallback keyword={keyword} set={set} noProject={!projectId} />
          </Scroll>
        </Tab.Item>
        <Tab.Item name={t('dataPanel.datas')}>
          <div className={c('h100p fbv')}>
            <DataToolbar useCreate />
            <Scroll>
              {folders_.topFolders.map((folder) => (
                <DataFolders
                  icon={<MoreIcon dataPanel={dataPanel} folder={folder} isTop />}
                  key={folder.folderId}
                  dataPanel={dataPanel}
                  folder={folder}
                  onNoDataClick={(e, button) => createMenu(e, button, dataPanel, folder, false, false)}
                />
              ))}
              {folders_.basicFolders.map((folder) => (
                <DataFolders
                  icon={<MoreIcon dataPanel={dataPanel} folder={folder} />}
                  key={folder.folderId}
                  dataPanel={dataPanel}
                  folder={folder}
                  onNoDataClick={(e, button) => createMenu(e, button, dataPanel, folder, false, false)}
                />
              ))}

              {hasData_ || <DataPanelFallback keyword={keyword} set={set} />}
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
