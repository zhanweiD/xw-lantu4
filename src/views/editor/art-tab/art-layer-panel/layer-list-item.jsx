import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import IconButton from '@components/icon-button'
import {DragSource, DropTarget} from '@components/drag-and-drop'
import w from '@models'
import s from './layer-list-item.module.styl'

const Sortable = observer(({layer, selectFrame, index, children, enable}) => {
  return enable ? (
    <DragSource
      key={layer.boxId}
      onEnd={(dropResult, data) => dropResult.changeSort(data)}
      dragKey={`ART_SORT_DRAG_KEY_FRAMEID_${layer?.frameId}`}
      data={{layer, index}}
    >
      <DropTarget
        hideOutLine
        acceptKey={`ART_SORT_DRAG_KEY_FRAMEID_${layer?.frameId}`}
        data={{changeSort: () => console.log('保存排序，暂时使用cmd+s手动保存')}}
        // data={{changeSort: layer?.saveArtSort}}
        hover={(item) => {
          // 需要重新赋值index，否则会出现无限交换情况
          if (item.index !== index) {
            console.log(item.index, index)
            // moveBoxToGroup
            // removeGroupByBoxes
            selectFrame.dropMove([item.layer], index)
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

const LayerListItem = ({layer, index, viewport, selectFrame, className, useButtons = true}) => {
  const {selectRange, toggleSelectBox, getMenuList} = viewport
  const {range = []} = selectRange || {}
  const {boxIds = []} = range[0] || {}
  const menu = w.overlayManager.get('menu')

  const isSelect = selectRange ? selectRange.range?.[0]?.boxIds?.find((item) => item === layer.boxId) : false

  return (
    <Sortable layer={layer} index={index} selectFrame={selectFrame} enable={true}>
      <div
        className={c('w100p', s.layer)}
        onContextMenu={(e) => {
          boxIds[0] !== layer.boxId && toggleSelectBox(layer, false)
          e.preventDefault()
          e.stopPropagation()
          menu.show({list: getMenuList(menu)})
        }}
        // onDoubleClick={layer.editArt}
      >
        <div className={c('fbh fbac pl8 pt4 pb4 pr8', s.layerItemBox, className, isSelect && s.selectLayerItemBox)}>
          <div
            className={c('fb1 omit ctw60 fbh fbac fs12 lh24 pl4')}
            onClick={(e) => {
              e.stopPropagation()
              menu.hide()
              toggleSelectBox(layer, e.shiftKey)
            }}
          >
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
                icon="lock"
                iconSize={14}
                // onClick={layer.previewArt}
              />
              <IconButton
                buttonSize={24}
                className={s.toolIconHighlight}
                icon="eye-open"
                iconSize={14}
                // onClick={layer.previewArt}
              />
            </div>
          )}
        </div>
      </div>
    </Sortable>
  )
}

export default observer(LayerListItem)
