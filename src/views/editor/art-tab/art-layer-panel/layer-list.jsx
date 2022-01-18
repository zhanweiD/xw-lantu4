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
//   console.log(layer)
//   const uploadRef = useRef(null)
//   const menu = w.overlayManager.get('menu')
//   // const onUpload = (files) => project.importArt(files, project.projectId)
//   const onClickMore = (e, button) => {
//     e.stopPropagation()
//     menu.toggle({
//       attachTo: button,
//       list: [
//         {name: '解组', action: () => (() => {}, menu.hide())},
//         {name: '复制', action: () => (() => {}, menu.hide())},
//         {name: '删除', action: () => (() => {}, menu.hide())},
//       ],
//     })
//   }
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
const list = [
  {name: '解组', action: () => (() => {}, menu.hide())},
  {name: '复制', action: () => (() => {}, menu.hide())},
  {name: '删除', action: () => (() => {}, menu.hide())},
]

// 项目列表
export default observer(({layer, index, viewport, groups, selectRange, other}) => {
  // layer有可能是box有可能是group,有boxes是group
  return layer.boxes ? (
    <Section
      key={layer.groupIds[0]}
      sessionId={`SKLayer-${layer.groupIds[0]}`}
      name={groups.find((group) => group.id === layer.groupIds[0])?.name}
      childrenClassName={c(s.pt0)}
      titleClassName={c('pt4 pb4', selectRange?.boxes_?.length !== layer.boxes.length && s.noSelectLayerGroup)}
      // extra={<MoreIcon layer={layer} />}
      onContextMenu={(e) => {
        console.log(111)
        e.preventDefault()
        e.stopPropagation()
        console.log(222)
        menu.show({list})
        console.log(333)
      }}
    >
      {layer.boxes.map((box) => (
        <div key={box.boxId}>
          <DragSource
            key={box.boxId}
            onEnd={(dropResult, data) => dropResult.create({layer: data, source: 'layer'})}
            dragKey="CREATE_ART_DRAG_KEY"
            data={box}
          >
            <LayerListItem layer={box} viewport={viewport} index={index} className="pl24" {...other} />
          </DragSource>
        </div>
      ))}
    </Section>
  ) : (
    <div key={layer.boxId}>
      <DragSource
        key={layer.boxId}
        onEnd={(dropResult, data) => dropResult.create({layer: data, source: 'layer'})}
        dragKey="CREATE_ART_DRAG_KEY"
        data={layer}
      >
        <LayerListItem layer={layer} viewport={viewport} index={index} {...other} />
      </DragSource>
    </div>
  )
})
