import {observer} from 'mobx-react-lite'
import React from 'react'
// import React, {useRef} from 'react'
import c from 'classnames'
// import IconButton from '@components/icon-button'
import Section from '@builders/section'
// import Upload from '@components/upload'
import {DragSource} from '@components/drag-and-drop'
// import w from '@models'
import LayerListItem from './layer-list-item'
import s from './art-layer-panel.module.styl'

// 成组后双击菜单
// const MoreIcon = ({project, isTop, isRecent}) => {
//   const uploadRef = useRef(null)
//   const menu = w.overlayManager.get('menu')
//   const onUpload = (files) => project.importArt(files, project.projectId)
//   const onClickMore = (e, button) => {
//     e.stopPropagation()
//     menu.toggle({
//       attachTo: button,
//       list: [
//         {name: '新建数据屏', action: () => (project.createArt(), menu.hide())},
//         {name: '导入数据屏', action: () => (uploadRef.current.click(), menu.hide())},
//         {name: '项目详情', action: () => (project.editProject(), menu.hide())},
//         {
//           name: !isRecent && (isTop ? '取消置顶项目' : '置顶项目'),
//           action: () => (project.projectPanel_.toggleProjectTop(project, !isTop), menu.hide()),
//         },
//       ],
//     })
//   }
//   return (
//     <div className="pr oh">
//       {isTop && <div className={s.delta} />}
//       <Upload accept=".json" multiple={false} onOk={onUpload}>
//         <div ref={uploadRef} />
//       </Upload>
//       <IconButton icon="more" iconSize={14} buttonSize={24} onClick={onClickMore} />
//     </div>
//   )
// }

// 项目列表
export default observer(({layer, index, art, groups, selectRange, other}) => {
  // layer有可能是box有可能是group,有boxes是group
  return layer.boxes ? (
    <Section
      key={layer.groupIds[0]}
      sessionId={`SKLayer-${layer.groupIds[0]}`}
      name={groups.find((group) => group.id === layer.groupIds[0])?.name}
      childrenClassName={c(s.pt0)}
      titleClassName={c(
        'pt4 pb4',
        selectRange?.range?.[0]?.boxIds?.length !== layer.boxes.length && s.noSelectLayerGroup
      )}
      // extra={icon}
    >
      {layer.boxes.map((box) => (
        <div key={box.boxId}>
          <DragSource
            key={box.boxId}
            onEnd={(dropResult, data) => dropResult.create({layer: data, source: 'layer'})}
            dragKey="CREATE_ART_DRAG_KEY"
            data={box}
          >
            <LayerListItem layer={box} art={art} index={index} className="pl24" {...other} />
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
        <LayerListItem layer={layer} art={art} index={index} {...other} />
      </DragSource>
    </div>
  )
})
