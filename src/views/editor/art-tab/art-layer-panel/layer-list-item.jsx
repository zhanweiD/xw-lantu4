import React from 'react'
import {observer} from 'mobx-react-lite'
import c from 'classnames'
import IconButton from '@components/icon-button'
import {DragSource, DropTarget} from '@components/drag-and-drop'
import w from '@models'
import s from './layer-list-item.module.styl'
import Title from './title'

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

const LayerListItem = ({layer, index, viewport, selectFrame, className, group}) => {
  const {selectRange, toggleSelectBox, getMenuList} = viewport
  const {range = []} = selectRange || {}
  const {boxIds = []} = range[0] || {}
  const menu = w.overlayManager.get('menu')

  const isSelect = selectRange ? selectRange.range?.[0]?.boxIds?.find((item) => item === layer.boxId) : false
  return (
    <Sortable layer={layer} index={index} selectFrame={selectFrame} enable={!layer.isLocked && layer.isEffect}>
      <div
        className={c('w100p', s.layer, (layer.isLocked || !layer.isEffect) && s.noDrop)}
        onContextMenu={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (layer.isLocked || !layer.isEffect) return
          boxIds[0] !== layer.boxId && boxIds.length < 2 && toggleSelectBox(layer, false)
          menu.show({list: getMenuList(menu)})
        }}
      >
        <div
          className={c(
            'fbh fbac pl8 pt4 pb4 pr8',
            s.layerItemBox,
            className,
            (isSelect || group?.isSelect) && s.selectLayerItemBox
          )}
        >
          <div
            className={c('fb1 omit ctw60 fbh fbac fs12 lh24 pl4')}
            onClick={(e) => {
              e.stopPropagation()
              !e.shiftKey && selectFrame?.groups?.forEach((group) => group.set({isSelect: false}))
              menu.hide()
              toggleSelectBox(layer, e.shiftKey)
            }}
          >
            {/* {!isLayerPanelVisible && <Icon fill="#fff5" name="drag" size={10} />} */}
            <div title={layer.name} className={c('omit', layer.isLocked || !layer.isEffect ? s.noDrop : 'hand')}>
              {/* {layer.name} */}
              <Title name={layer.name} onChange={layer.reName} />
            </div>
          </div>
          <div className={c('fbh')}>
            {layer.isLocked ? (
              <IconButton
                buttonSize={24}
                className={s.toolIconHighlight}
                icon="lock"
                iconSize={14}
                onClick={() => layer.set({isLocked: false})}
              />
            ) : null}
            {layer.isEffect ? (
              <IconButton
                buttonSize={24}
                className={s.toolIconHighlight}
                icon="eye-open"
                iconSize={14}
                onClick={() => layer.set({isEffect: false})}
              />
            ) : (
              <IconButton
                buttonSize={24}
                className={s.toolIconHighlight}
                icon="eye-close"
                iconSize={14}
                onClick={() => layer.set({isEffect: true})}
              />
            )}
          </div>
        </div>
      </div>
    </Sortable>
  )
}

export default observer(LayerListItem)
