import {observer} from 'mobx-react-lite'
import React from 'react'
import c from 'classnames'
// import IconButton from '@components/icon-button'
import Section from '@builders/section'
// import Upload from '@components/upload'
import {DragSource} from '@components/drag-and-drop'
import w from '@models'
import LayerListItem from './layer-list-item'
import s from './art-layer-panel.module.styl'

// 成组后双击菜单
// const MoreIcon = ({layer}) => {
//   return (
//     <div className="pr oh">
//       {/* {isTop && <div className={s.delta} />} */}
//       <Upload accept=".json" multiple={false} onOk={() => {}}>
//         <div ref={uploadRef} />
//       </Upload>
//       <IconButton icon="more" iconSize={14} buttonSize={24} onClick={onClickMore} />
//     </div>
//   )
// }

const menu = w.overlayManager.get('menu')
const getMenuList = (selectFrame, group) => {
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
        const currentBoxes = selectFrame.boxes.filter((item) => group.boxIds.includes(item.boxId))
        selectFrame.moveGroup(group, currentBoxes[currentBoxes.length - 1].zIndex_ + 1)
        menu.hide()
      },
    },
    {
      name: '下移一层',
      action: () => {
        const currentBoxes = selectFrame.boxes.filter((item) => group.boxIds.includes(item.boxId))
        selectFrame.moveGroup(group, currentBoxes[currentBoxes.length - 1].zIndex_ - 1)
        menu.hide()
      },
    },
    {name: '取消成组', action: () => (() => {}, menu.hide())},
    {name: '锁定', hideBtmBorder: true, action: () => (() => {}, menu.hide())},
    {name: '隐藏', action: () => (() => {}, menu.hide())},
    {name: '复制', hideBtmBorder: true, action: () => (() => {}, menu.hide())},
    {name: '删除', action: () => (() => {}, menu.hide())},
  ]
  return menuList
}

// 项目列表
export default observer(({layer, viewport, groups, selectFrame, other}) => {
  // console.log(selectRange)
  // layer有可能是box有可能是group
  const {groupIds = [], boxes} = layer
  const group = groups.find((group) => group.id === groupIds[0])

  return group ? (
    <Section
      key={groupIds[0]}
      sessionId={`SKLayer-${groupIds[0]}`}
      name={group.name}
      childrenClassName={c(s.pt0)}
      titleClassName={c('pt4 pb4', !group.isSelect && s.noSelectLayerGroup)}
      // extra={<MoreIcon layer={layer} />}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        menu.show({list: getMenuList(selectFrame, group)})
        selectFrame.selectGroup(group, false)
      }}
      onClick={(e) => {
        selectFrame.selectGroup(group, e.shiftKey)
      }}
    >
      {boxes.map((box) => (
        <div key={box.boxId}>
          <DragSource
            key={box.boxId}
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
      <div key={box.boxId}>
        <DragSource
          key={box.boxId}
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
