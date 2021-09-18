import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import w from '@models'
import copy from '@utils/copy'
import Icon from '@components/icon'
import s from './data-thumbnail.module.styl'

const DataThumbnail = ({data}) => {
  const {dataType, dataName} = data
  const icon = {
    json: 'data-json',
    excel: 'data-excel',
    mysql: 'data-mysql',
    api: 'data-api',
  }[dataType]

  return (
    <div
      className={c('mb8 pl8 oh omit ctw52 lh24 fbh fbac', s.data, data.isActive_ && s.activeData)}
      onDoubleClick={data.showDetail}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const menu = w.overlayManager.get('menu')
        menu.show({
          list: [
            {
              name: '复制数据ID',
              action: () => {
                copy(data.dataId)
                w.env_.tip.success({content: '复制成功'})
                menu.hide()
              },
            },
            {
              name: '删除',
              action: () => {
                data.confirm('removeData')
                menu.hide()
              },
            },
          ],
        })
      }}
    >
      <Icon name={icon} size={16} />
      <div
        className="ml8 fb1 omit"
        onDoubleClick={() => {
          data.showDetail(s)
        }}
      >
        {dataName}
      </div>
    </div>
  )
}

export default observer(DataThumbnail)
