import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import IconButton from '@components/icon-button'
import {DragSource, DropTarget} from '@components/drag-and-drop'
import w from '@models'
import s from './layer-list-item.module.styl'

const Sortable = observer(({layer, index, children, enable}) => {
  return enable ? (
    <DragSource
      key={layer.boxId}
      onEnd={(dropResult, data) => dropResult.changeSort(data)}
      dragKey={`ART_SORT_DRAG_KEY_LAYERPANEL_${layer?.boxId}`}
      data={{layer, index}}
    >
      <DropTarget
        hideOutLine
        acceptKey={`ART_SORT_DRAG_KEY_PROJECTID_${layer?.boxId}`}
        data={{changeSort: layer?.saveArtSort}}
        hover={(item) => {
          // 需要重新赋值index，否则会出现无限交换情况
          if (item.index !== index) {
            layer.moveArtSort(item.index, index)
            item.index = index
          }
        }}
      >
        {children}
      </DropTarget>
    </DragSource>
  ) : (
    children
  )
})

const LayerList = ({layer, index, useButtons = true}) => {
  const {sidebar} = w

  const {projectPanel} = sidebar
  const {isLayerPanelVisible} = projectPanel
  // const menu = w.overlayManager.get('menu')
  // const list = [
  //   {name: '编辑', action: () => (art.editArt(), menu.hide())},
  //   {name: '预览', action: () => (art.previewArt(), menu.hide())},
  //   !isTemplate && {name: '保存为模板', action: () => (art.saveAsTemplate(), menu.hide())},
  //   {name: '更新缩略图', action: () => (art.updateLayerPanel(), menu.hide())},
  //   !isTemplate && {name: '复制', action: () => (art.copyArt(), menu.hide())},
  //   !isTemplate && {name: '导出', action: () => (art.exportArt(), menu.hide())},
  //   {name: '删除', action: () => (art.removeArt(), menu.hide())},
  // ].filter(Boolean)

  // console.log('====', art.toJSON())

  return (
    <Sortable layer={layer} index={index} enable={!isLayerPanelVisible}>
      <div
        className={c('w100p', s.layer)}
        // onContextMenu={(e) => (e.preventDefault(), e.stopPropagation(), menu.show({list}))}
        // onDoubleClick={layer.editArt}
      >
        {/* {isLayerPanelVisible && <div className={c(s.layerPanelContainer)} style={art.layerPanelStyle_} />} */}
        <div className={c('fbh fbac pl8 pt4 pb4 pr8', s.layerItemBox)}>
          <div className={c('fb1 omit ctw60 fbh fbac fs12 lh24 pl4', layer.isActive_ && s.activeArt)}>
            {/* {!isLayerPanelVisible && <Icon fill="#fff5" name="drag" size={10} />} */}
            <div title={layer.name} className="omit hand">
              {layer.name}
            </div>
          </div>
          {useButtons && (
            <div className={c('fbh')}>
              <IconButton
                buttonSize={24}
                className={s.toolIconHighlight}
                icon="eye-open"
                // onClick={layer.previewArt}
              />
            </div>
          )}
        </div>
      </div>
    </Sortable>
  )
}

export default observer(LayerList)
