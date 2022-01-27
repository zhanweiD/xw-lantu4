import {observer} from 'mobx-react-lite'
import React from 'react'
import c from 'classnames'
import IconButton from '@components/icon-button'
import Section from '@builders/section'
import {DragSource} from '@components/drag-and-drop'
import w from '@models'
import LayerListItem from './layer-list-item'
import s from './art-layer-panel.module.styl'
import Title from './title'

// 成组后双击菜单
const MoreIcon = ({selectFrame, group, isEffect, isLocked}) => {
  return (
    <div className="pr oh fbh mr8">
      {isLocked ? (
        <IconButton
          buttonSize={24}
          className={s.toolIconHighlight}
          icon="lock"
          iconSize={14}
          onClick={() => {
            selectFrame.toggleGroupState(group, 'isLocked')
          }}
        />
      ) : null}
      {isEffect ? (
        <IconButton
          buttonSize={24}
          className={s.toolIconHighlight}
          icon="eye-open"
          iconSize={14}
          onClick={() => {
            selectFrame.toggleGroupState(group, 'isEffect')
          }}
        />
      ) : (
        <IconButton
          buttonSize={24}
          className={s.toolIconHighlight}
          icon="eye-close"
          iconSize={14}
          onClick={() => {
            selectFrame.toggleGroupState(group, 'isEffect')
          }}
        />
      )}
    </div>
  )
}

const menu = w.overlayManager.get('menu')
const getMenuList = (selectFrame, group, viewport) => {
  const boxes = selectFrame.boxes.filter((item) => group.boxIds.includes(item.boxId))
  const zIndexList = boxes.map((item) => item.zIndex_)
  const minBoxIndex = Math.min(...zIndexList)
  const maxBoxIndex = Math.max(...zIndexList)
  const maxIndexBoxId = selectFrame.boxes.find((item) => item.zIndex_ === maxBoxIndex + 1)?.boxId
  const minIndexBoxId = selectFrame.boxes.find((item) => item.zIndex_ === minBoxIndex - 1)?.boxId
  const upTargetIndex = maxBoxIndex + (selectFrame.getGroupBoxNum(maxIndexBoxId) || 1)
  const downTargetIndex = minBoxIndex - (selectFrame.getGroupBoxNum(minIndexBoxId) || 1)
  const menuList = [
    {
      name: '置顶',
      hideBtmBorder: true,
      action: () => {
        selectFrame.moveGroup(group, selectFrame.boxes.length)
        menu.hide()
      },
    },
    {
      name: '置底',
      hideBtmBorder: true,
      action: () => {
        selectFrame.moveGroup(group, 0)
        menu.hide()
      },
    },
    {
      name: '上移一层',
      hideBtmBorder: true,
      action: () => {
        selectFrame.moveGroup(group, upTargetIndex)
        menu.hide()
      },
    },
    {
      name: '下移一层',
      action: () => {
        selectFrame.moveGroup(group, downTargetIndex)
        menu.hide()
      },
    },
    {
      name: '取消成组',
      action: () => {
        selectFrame.removeGroupByBoxes(boxes)
        menu.hide()
      },
    },
    {
      name: `${group.isLocked ? '解锁' : '锁定'}`,
      hideBtmBorder: true,
      action: () => {
        selectFrame.toggleGroupState(group, 'isLocked')
        menu.hide()
      },
    },
    {
      name: `${group.isEffect ? '隐藏' : '显示'}`,
      action: () => {
        selectFrame.toggleGroupState(group, 'isEffect')
        menu.hide()
      },
    },
    {
      name: '复制',
      hideBtmBorder: true,
      action: () => {
        selectFrame.copyGroup(boxes, true)
        menu.hide()
      },
    },
    {
      name: '删除',
      action: () => {
        viewport.selectRange.remove()
        menu.hide()
      },
    },
  ]
  return menuList
}

// 项目列表
export default observer(({layer, viewport, selectFrame, other}) => {
  // layer有可能是box有可能是group
  const {group, boxes} = layer
  return group.id ? (
    <Section
      key={group.id}
      sessionId={`SKLayer-${group.id}`}
      // name={group.name}
      name={
        <Title
          name={group.name}
          onChange={(name) => {
            group.reName(name)
            selectFrame.updatePartFrame({groups: selectFrame.groups})
          }}
        />
      }
      childrenClassName={c(s.pt0)}
      titleClassName={c('pt4 pb4', !group.isSelect && s.noSelectLayerGroup)}
      extra={<MoreIcon selectFrame={selectFrame} group={group} isLocked={group?.isLocked} isEffect={group?.isEffect} />}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        menu.show({list: getMenuList(selectFrame, group, viewport)})
        selectFrame.selectGroup(group, false)
      }}
      onClick={(e) => {
        selectFrame.selectGroup(group, e.shiftKey)
      }}
    >
      {boxes.map((box) => (
        <div key={`${box.boxId}-box`}>
          <DragSource
            key={`${box.boxId}-drag`}
            onEnd={(dropResult, data) => dropResult.create({layer: data, source: 'layer'})}
            dragKey="CREATE_ART_DRAG_KEY"
            data={box}
          >
            <LayerListItem
              layer={box}
              group={group}
              viewport={viewport}
              selectFrame={selectFrame}
              index={box.zIndex_}
              className="pl24"
              {...other}
            />
          </DragSource>
        </div>
      ))}
    </Section>
  ) : (
    boxes.map((box) => (
      <div key={`${box.boxId}-box`}>
        <DragSource
          key={`${box.boxId}-drag`}
          onEnd={(dropResult, data) => dropResult.create({layer: data, source: 'layer'})}
          dragKey="CREATE_ART_DRAG_KEY"
          data={box}
        >
          <LayerListItem layer={box} viewport={viewport} selectFrame={selectFrame} index={box.zIndex_} {...other} />
        </DragSource>
      </div>
    ))
  )
})
