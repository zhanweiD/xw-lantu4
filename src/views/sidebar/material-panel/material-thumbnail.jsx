import React, {useState} from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import {DragSource} from '@components/drag-and-drop'
import Geo from '@components/geo-preview'
import Icon from '@components/icon'
import config from '@utils/config'
import w from '@models'
import s from './material-panel.module.styl'
import isDev from '@utils/is-dev'

const MaterialView = ({material, showType}) => {
  let F
  const [onload, setOnload] = useState(false)
  switch (material.type) {
    case 'image':
      F = (
        <img
          className={c('hand', {
            [s.grid]: showType === 'grid-layout',
            [s.thumbnail]: showType !== 'grid-layout',
          })}
          alt={material.name}
          draggable={false}
          src={`${config.urlPrefix}material/download/${material.materialId}`}
          style={{height: !onload && `${(material.height / material.width) * 270}px`}}
          onLoad={() => setOnload(true)}
        />
      )
      break
    case 'GeoJSON':
      F = <Geo path={`${config.urlPrefix}material/download/${material.materialId}`} />
      break
    case 'decoration':
      F = (
        <Icon
          className={c('hand', {
            [s.grid]: showType === 'grid-layout',
            [s.thumbnail]: showType !== 'grid-layout',
          })}
          name={material.icon}
          size={50}
        />
      )
      break
    default:
      null
  }
  return F
}

const Material = ({material, showType}) => {
  return (
    <DragSource
      key={material.materialId}
      onEnd={(dropResult, data, position) => {
        w.env_.event.fire('editor.setProps', {isPointerEventsNone: false})
        const {type, lib, key, materialId, name} = data
        const params = {
          type,
          lib,
          key,
        }
        if (type !== 'decoration') {
          params.materialId = materialId
          params.name = name
        }
        dropResult.createBackground({
          ...params,
          position,
        })
      }}
      onBegin={() => w.env_.event.fire('editor.setProps', {isPointerEventsNone: true})}
      dragKey="UPDATE_BOX_BACKGROUND_DRAGE_KEY"
      data={material}
    >
      <div
        className={c('oh mr8 ml8')}
        onDoubleClick={material.type !== 'decoration' ? material.showDetail : null}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const menu = w.overlayManager.get('menu')
          const list = []
          isDev && list.push({name: '复制素材ID', action: () => (material.copyId(), menu.hide())})
          !material.isOfficial && list.push({name: '删除', action: () => (material.remove(), menu.hide())})
          menu.show({list})
        }}
      >
        {showType !== 'list' && (
          <div className={c('cfw6 fbh', {[s.gridWrap]: showType === 'grid-layout'})}>
            <MaterialView material={material} showType={showType} />
          </div>
        )}
        {showType !== 'grid-layout' && (
          <div className={c('fbh fbac lh24', {mb8: showType === 'thumbnail-list'})}>
            <div className={c('fb1 omit ctw60 fbh fbac pl4', {[s.activeMaterial]: material.isActive_})}>
              {showType === 'list' && <Icon fill="#fff5" name="drag" size={10} />}
              <div title={material.name} className="omit hand">
                {material.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </DragSource>
  )
}

export default observer(Material)
