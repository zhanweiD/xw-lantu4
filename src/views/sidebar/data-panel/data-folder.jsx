import {observer} from 'mobx-react-lite'
import Section from '@components/section'
import React from 'react'
import DataThumbnail from './data-thumbnail'
import c from 'classnames'
import w from '@models'

const createMenu = (e, button, folder) => {
  const {createData, folderId} = folder
  e.stopPropagation()
  const menu = w.overlayManager.get('menu')
  menu.toggle({
    attachTo: button,
    list: [
      {name: '新建Excel', action: () => (createData({folderId, dataType: 'excel'}), menu.hide())},
      {name: '新建JSON', action: () => (createData({folderId, dataType: 'json'}), menu.hide())},
      {name: '新建API', action: () => (createData({folderId, dataType: 'api'}), menu.hide())},
    ],
  })
}

const DataFolder = ({folder, icon}) => {
  const {dataList_, folderName, section} = folder
  return (
    <Section
      childrenClassName="pt8 pb8"
      icon={icon}
      name={`${folderName} (${dataList_.length})`}
      props={section}
      sessionId={`data-folder-${folder.folderId}`}
    >
      {dataList_.length ? (
        dataList_.map((data) => <DataThumbnail data={data} key={data.dataId} />)
      ) : (
        <div className={c('mb16 emptyNote')}>
          <div>
            列表还是空空的，点击
            <span className="ctSecend hand" onClick={(e, button) => createMenu(e, button, folder)}>
              新建
            </span>
          </div>
        </div>
      )}
    </Section>
  )
}

export default observer(DataFolder)
